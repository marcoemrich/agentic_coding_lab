/**
 * Subagent extension for pi
 * Handles execution of subagents in isolated contexts
 */

// Mock the vscode API for this example
const vscode = {
  env: {
    machineId: 'some-mock-id'
  },
  version: '1.80.0'
};

// Store for registered commands
const commands = new Map();

// Register command function
function registerCommand(commandName, callback) {
  commands.set(commandName, callback);
}

// Mock workspace
const workspace = {
  getConfiguration: () => ({
    get: (key) => {
      if (key === 'pi.defaultModel') return 'gpt-4';
      return undefined;
    }
  })
};

// Mock configuration
const configuration = {
  PI_INHERIT_MODEL: true
};

// Mock logger
const logger = {
  log: (msg) => console.log(`[subagent] ${msg}`),
  error: (msg) => console.error(`[subagent] ERROR: ${msg}`)
};

// Command implementation
async function runSubagentCommand(agent, options = {}) {
  logger.log(`Running subagent: ${agent}`);
  
  // Validate agent parameter
  if (!agent) {
    throw new Error('Agent name is required');
  }
  
  try {
    // Construct agent path
    // In a real implementation, this would resolve agent paths based on scope
    let agentPath;
    if (options.agentScope === 'both') {
      // Look in both user and project locations
      agentPath = `.pi/agents/${agent}.js`;
    } else {
      agentPath = `~/.pi/agents/${agent}.js`;
    }
    
    logger.log(`Resolved agent path: ${agentPath}`);
    
    // Import the agent module
    // In a real implementation, this would use proper module resolution
    const fs = require('fs');
    
    if (!fs.existsSync(agentPath)) {
      throw new Error(`Agent file not found: ${agentPath}`);
    }
    
    // Import the agent
    const agentModule = require(agentPath);
    
    // Validate agent module
    if (!agentModule || typeof agentModule.run !== 'function') {
      throw new Error(`Invalid agent module: ${agentPath}`);
    }
    
    // Create context for the agent
    const context = {
      task: options.task,
      args: options.args || {},
      workspace: {
        rootPath: process.cwd()
      }
    };
    
    // Execute the agent
    logger.log(`Executing agent ${agent} with task: ${options.task}`);
    const result = await agentModule.run(context);
    
    logger.log(`Agent ${agent} completed successfully`);
    return result;
    
  } catch (error) {
    logger.error(`Failed to run subagent ${agent}: ${error.message}`);
    throw error;
  }
}

// Register the command
registerCommand('subagent.run', runSubagentCommand);

// Export for activation
module.exports = {
  activate: (context) => {
    logger.log('Subagent extension activated');
    
    // In a real extension, we would register commands with the actual context
    // For this mock, we've already registered in the module scope
    
    return {
      exports: {
        run: runSubagentCommand
      }
    };
  },
  deactivate: async () => {
    logger.log('Subagent extension deactivated');
  }
};

// Make available globally for the mock
globalThis.vscode = vscode;
globalThis.commands = commands;
globalThis.workspace = workspace;
