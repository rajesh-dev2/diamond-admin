import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';
import { baseURL } from '@/api/axios';

export interface UseMatchOddsSocketOptions {
  gmid?: number;
  etid?: number;
  url?: string;
  enabled?: boolean;
}

// Falls back to the same host the REST API uses (minus the /api suffix)
// when VITE_SOCKET_URL isn't set, instead of letting socket.io-client
// default to the page's own origin (e.g. ws://localhost:3000).
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || baseURL?.replace(/\/api\/?$/, '');

export function useMatchOddsSocket({
  gmid = 0,
  etid = 1,
  url = SOCKET_URL,
  enabled = true,
}: UseMatchOddsSocketOptions = {}) {
  const token = useAppSelector((state) => state.auth.token);

  const [marketData, setMarketData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  const socketRef = useRef<Socket | null>(null);
  const isMountedRef = useRef(true);
  const joinedGmidRef = useRef<number | null>(null); // which room we're actually in right now

  // Store params in refs so connect callback remains stable
  const paramsRef = useRef({ gmid, etid, url, enabled, token });

  useEffect(() => {
    const prevGmid = paramsRef.current.gmid;
    paramsRef.current = { gmid, etid, url, enabled, token };

    // If the socket's already up and gmid changed, switch rooms without
    // reconnecting — leave the old match's room, join the new one. Our
    // rooms are keyed by gmid alone (domain comes from the account, not
    // sent by the client), so there's no "etid" in this call.
    if (
      socketRef.current?.connected &&
      prevGmid !== gmid &&
      gmid && !isNaN(Number(gmid))
    ) {
      console.log('[Socket.IO] gmid changed — switching rooms:', { from: prevGmid, to: gmid });
      if (joinedGmidRef.current) {
        socketRef.current.emit('leave:match', joinedGmidRef.current);
      }
      socketRef.current.emit('join:match', gmid);
      joinedGmidRef.current = gmid;
    }
  }, [gmid, etid, url, enabled, token]);

  const destroySocket = useCallback(() => {
    if (socketRef.current) {
      const socket = socketRef.current;
      if (joinedGmidRef.current) {
        socket.emit('leave:match', joinedGmidRef.current);
        joinedGmidRef.current = null;
      }
      socketRef.current = null;
      socket.removeAllListeners();
      socket.disconnect();
    }
  }, []);

  const connect = useCallback(() => {
    const { gmid: currentGmid, url: currentUrl, enabled: currentEnabled, token: currentToken } = paramsRef.current;

    if (!currentEnabled) return;

    // Clean up previous socket if any
    destroySocket();

    setConnectionStatus('connecting');

    const socket = io(currentUrl, {
      auth: { token: currentToken, scope: 'user' }, // admin AND client both use scope "user"
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (!isMountedRef.current || socketRef.current !== socket) return;
      setIsConnected(true);
      setConnectionStatus('connected');

      console.log('[Socket.IO] joining match room:', currentGmid);
      socket.emit('join:match', currentGmid);
      joinedGmidRef.current = currentGmid;
    });

    // Full snapshot every tick — replace, don't merge, so anything that
    // disappeared (removed selection/market) drops out automatically too.
    socket.on('markets:update', ({ gmid: updatedGmid, data }: { gmid: number; data: any[] }) => {
      if (!isMountedRef.current || socketRef.current !== socket) return;
      if (Number(updatedGmid) !== Number(paramsRef.current.gmid)) return; // stale event from a room we've since left
      console.log('[Socket.IO] markets:update received:', updatedGmid, data.length, 'markets');
      setMarketData(data);
    });

    // A whole market disappeared from the provider — drop it from state.
    socket.on('markets:removed', ({ gmid: updatedGmid, marketIds }: { gmid: number; marketIds: string[] }) => {
      if (!isMountedRef.current || socketRef.current !== socket) return;
      if (Number(updatedGmid) !== Number(paramsRef.current.gmid)) return;
      console.log('[Socket.IO] markets:removed received:', marketIds);
      setMarketData((prev) => prev.filter((m) => !marketIds.includes(m.marketId)));
    });

    socket.on('disconnect', (reason) => {
      if (!isMountedRef.current || socketRef.current !== socket) return;
      console.warn('[Socket.IO] Disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      if (!isMountedRef.current || socketRef.current !== socket) return;
      console.error('[Socket.IO] Connection error:', err.message);
      setIsConnected(false);
      setConnectionStatus('error');
    });
  }, [destroySocket]);

  // Mount once — connect and clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      destroySocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, destroySocket]);

  return {
    marketData,
    isConnected,
    connectionStatus,
    reconnect: connect,
  };
}

export default useMatchOddsSocket;
