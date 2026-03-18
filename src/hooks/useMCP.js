/**
 * useMCP — placeholder hook for Pathways MCP server integration.
 *
 * Wire up real MCP tool calls here. The UI components call `callTool` and
 * `listTools` without knowing the underlying transport. Swap this stub for
 * a real MCP client implementation when the server is available.
 */

import { useState, useEffect, useCallback } from 'react';

const MCP_SERVER_URL = 'http://localhost:3000/mcp'; // placeholder

// Stub tool list — replace with dynamic listing from MCP server
const STUB_TOOLS = [
  { name: 'search_segments', description: 'Search population segments by country and criteria' },
  { name: 'get_country_data', description: 'Retrieve Pathways data coverage for a country' },
  { name: 'get_segment_profile', description: 'Get full profile for a named segment' },
  { name: 'list_indicators', description: 'List available health indicators' },
  { name: 'get_geographic_distribution', description: 'Get geographic distribution of a segment' },
];

export function useMCP() {
  const [connected, setConnected] = useState(false);
  const [tools, setTools] = useState([]);
  const [error, setError] = useState(null);

  // Stub: simulate a connection attempt on mount
  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      try {
        // TODO: Replace with real MCP handshake
        // const response = await fetch(`${MCP_SERVER_URL}/tools/list`);
        // const data = await response.json();
        // setTools(data.tools);

        // Stub: always show as connected with stub tools after short delay
        await new Promise((r) => setTimeout(r, 800));
        if (!cancelled) {
          setTools(STUB_TOOLS);
          setConnected(true);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setConnected(false);
          setError('Unable to reach MCP server');
        }
      }
    };

    connect();
    return () => { cancelled = true; };
  }, []);

  /**
   * Call an MCP tool by name with given arguments.
   * Returns a promise that resolves to the tool result.
   *
   * TODO: Replace stub implementation with real MCP call:
   *   POST ${MCP_SERVER_URL}/tools/call  { name, arguments }
   */
  const callTool = useCallback(async (toolName, args = {}) => {
    if (!connected) {
      throw new Error('MCP server is not connected');
    }

    // Stub response — real implementation sends to MCP server
    console.log('[MCP] callTool:', toolName, args);

    return {
      tool: toolName,
      args,
      result: null, // placeholder — real result from server
      isStub: true,
    };
  }, [connected]);

  /**
   * List available MCP tools.
   */
  const listTools = useCallback(() => tools, [tools]);

  return {
    connected,
    tools,
    error,
    callTool,
    listTools,
    serverUrl: MCP_SERVER_URL,
  };
}
