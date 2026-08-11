import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseMatchOddsSocketOptions {
  gmid?: number;
  etid?: number;
  url?: string;
  enabled?: boolean;
}

export interface MatchOddsSocketMessage {
  type: 'connected' | 'subscribed' | 'matchOdds' | 'ping' | 'error' | string;
  data?: any[];
  message?: string;
  gmid?: number;
  etid?: number;
  pollMs?: number;
  stale?: boolean;
  timestamp?: number;
}

export function useMatchOddsSocket({
  gmid = 542267677,
  etid = 1,
  url = 'wss://sky99.co/ws/admin/match-odds',
  enabled = true,
}: UseMatchOddsSocketOptions = {}) {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // Store params in refs so connect callback remains stable
  const paramsRef = useRef({ gmid, etid, url, enabled });

  useEffect(() => {
    const prevGmid = paramsRef.current.gmid;
    const prevEtid = paramsRef.current.etid;
    paramsRef.current = { gmid, etid, url, enabled };

    // If socket is open and gmid or etid changed, re-subscribe immediately without reconnecting
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      (prevGmid !== gmid || prevEtid !== etid) &&
      gmid && etid && !isNaN(Number(gmid)) && !isNaN(Number(etid))
    ) {
      const subscribePayload = JSON.stringify({ type: 'subscribe', gmid, etid });
      console.log('[WebSocket] Params changed — sending re-subscribe:', subscribePayload);
      socketRef.current.send(subscribePayload);
    }
  }, [gmid, etid, url, enabled]);

  // Helper to detach event handlers and close socket safely without triggering handleReconnect
  const destroySocket = useCallback(() => {
    if (socketRef.current) {
      const ws = socketRef.current;
      socketRef.current = null;
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }
  }, []);

  const connect = useCallback(() => {
    const { gmid: currentGmid, etid: currentEtid, url: currentUrl, enabled: currentEnabled } = paramsRef.current;

    if (!currentEnabled) return;

    // Clean up previous socket if any without triggering onclose reconnect
    destroySocket();

    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket(currentUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current || socketRef.current !== ws) return;
        setIsConnected(true);
        setConnectionStatus('connected');

        // Send subscribe payload on open
        const subscribePayload = JSON.stringify({
          type: 'subscribe',
          gmid: currentGmid,
          etid: currentEtid,
        });
        console.log('[WebSocket] Sending subscribe payload:', subscribePayload);
        ws.send(subscribePayload);
      };

      ws.onmessage = (e) => {
        if (!isMountedRef.current || socketRef.current !== ws) return;
        try {
          const msg: MatchOddsSocketMessage = JSON.parse(e.data);
          console.log('[WebSocket] Message received:', msg.type, msg);

          if (msg.type === 'matchOdds') {
            if (msg.stale !== undefined) {
              setIsStale(!!msg.stale);
            }
            if (Array.isArray(msg.data)) {
              setMarketData(msg.data);
            }
          } else if (msg.type === 'ping') {
            // Reply with pong if server pings
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (err) {
          console.error('[WebSocket] JSON parse error:', err);
        }
      };

      const handleReconnect = () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
        setConnectionStatus('disconnected');

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        // Reconnect after short delay (1000ms)
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && paramsRef.current.enabled) {
            console.log('[WebSocket] Reconnecting & re-subscribing...');
            connect();
          }
        }, 1000);
      };

      ws.onclose = (event) => {
        console.warn('[WebSocket] Closed:', event.code, event.reason);
        if (socketRef.current === ws) {
          socketRef.current = null;
          handleReconnect();
        }
      };

      ws.onerror = (err) => {
        console.error('[WebSocket] Error event:', err);
        if (socketRef.current === ws) {
          destroySocket();
          handleReconnect();
        }
      };
    } catch (error) {
      console.error('[WebSocket] Connection creation error:', error);
      setConnectionStatus('error');

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && paramsRef.current.enabled) {
          connect();
        }
      }, 1000);
    }
  }, [destroySocket]);

  // Mount once — connect and clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      destroySocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, destroySocket]);

  return {
    marketData,
    isStale,
    isConnected,
    connectionStatus,
    reconnect: connect,
  };
}

export default useMatchOddsSocket;
