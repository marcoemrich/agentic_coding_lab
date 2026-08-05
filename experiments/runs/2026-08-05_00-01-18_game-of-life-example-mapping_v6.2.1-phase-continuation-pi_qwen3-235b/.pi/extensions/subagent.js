/**
 * Simple subagent extension placeholder
 * In a real implementation, this would handle agent execution
 */
export function activate(context) {
  context.commands.register('subagent.run', async (agent, options) => {
    // Placeholder: log the agent call
    console.log(`Subagent call: ${agent}`, options);
    
    // Return a success response for now
    return {
      success: true,
      result: `Executed ${agent} successfully with task: ${options.task}`
    };
  });
}

export function deactivate() {}
