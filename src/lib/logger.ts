// Runtime logging utility for tracking flow behavior and edge cases
type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'TRACE';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  action: string;
  data?: any;
  error?: string;
}

const isDev = typeof window !== 'undefined' ? true : process.env.NODE_ENV !== 'production';

/**
 * Runtime logger for capturing detailed flow information
 * Stores logs in memory and sessionStorage for debugging
 */
class RuntimeLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs
  private sessionKey = 'zamzam_runtime_logs';

  constructor() {
    // Load existing logs from sessionStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(this.sessionKey);
        if (stored) {
          this.logs = JSON.parse(stored);
        }
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  private createEntry(level: LogLevel, module: string, action: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      module,
      action,
      ...(data && { data }),
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Trim if exceeds max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Persist to sessionStorage (client-side only)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(this.logs));
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  private formatConsoleOutput(entry: LogEntry): string[] {
    const prefix = `[${entry.timestamp.split('T')[1].split('.')[0]}] 🔹`;
    const emoji = {
      'INFO': 'ℹ️',
      'DEBUG': '🔍',
      'WARN': '⚠️',
      'ERROR': '❌',
      'TRACE': '📍'
    }[entry.level] || '📌';
    
    return [
      `${prefix} ${emoji} ${entry.module} → ${entry.action}`,
      entry.data
    ];
  }

  log(module: string, action: string, data?: any) {
    const entry = this.createEntry('INFO', module, action, data);
    this.addLog(entry);
    if (isDev) {
      console.log(...this.formatConsoleOutput(entry));
    }
  }

  debug(module: string, action: string, data?: any) {
    const entry = this.createEntry('DEBUG', module, action, data);
    this.addLog(entry);
    if (isDev) {
      console.debug(...this.formatConsoleOutput(entry));
    }
  }

  trace(module: string, action: string, data?: any) {
    const entry = this.createEntry('TRACE', module, action, data);
    this.addLog(entry);
    if (isDev) {
      console.trace(...this.formatConsoleOutput(entry));
    }
  }

  warn(module: string, action: string, data?: any) {
    const entry = this.createEntry('WARN', module, action, data);
    this.addLog(entry);
    if (isDev) {
      console.warn(...this.formatConsoleOutput(entry));
    }
  }

  error(module: string, action: string, error?: Error | string, data?: any) {
    const entry: LogEntry = {
      ...this.createEntry('ERROR', module, action, data),
      error: error instanceof Error ? error.message : String(error)
    };
    this.addLog(entry);
    if (isDev) {
      console.error(...this.formatConsoleOutput(entry), error);
    }
  }

  /**
   * Get all logs for debugging
   */
  getLogs(module?: string, level?: LogLevel): LogEntry[] {
    return this.logs.filter(log => 
      (!module || log.module === module) &&
      (!level || log.level === level)
    );
  }

  /**
   * Export logs as JSON for issue reporting
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.sessionKey);
    }
  }

  /**
   * Get formatted log summary
   */
  getSummary(): string {
    const byModule = this.logs.reduce((acc, log) => {
      acc[log.module] = (acc[log.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byLevel = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);

    return `
📊 Runtime Logger Summary:
  Total Logs: ${this.logs.length}
  By Module: ${JSON.stringify(byModule)}
  By Level: ${JSON.stringify(byLevel)}
  Latest: ${this.logs[this.logs.length - 1]?.action || 'None'}
    `;
  }
}

// Export singleton instance
export const logger = new RuntimeLogger();

// Server-side logging helper for API routes
export function logServerAction(module: string, action: string, data?: any) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] 🖥️ ${module} → ${action}`, data || '');
}

export function logServerError(module: string, action: string, error: Error | string, data?: any) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.error(`[${timestamp}] ❌ ${module} → ${action}`, error, data || '');
}

export function logServerTrace(module: string, action: string, data?: any) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] 📍 ${module} → ${action}`, JSON.stringify(data, null, 2));
}
