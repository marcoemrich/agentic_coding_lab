import { read, write, edit, bash, grep, find, ls } from '@earendil-works/pi-coding-agent';
import { AgentFunction, AgentContext } from '@earendil-works/pi-coding-agent';

export const agent: AgentFunction = async (context: AgentContext) => {
  // Parse the task to get file paths and test count
  const lines = context.prompt.split('\n');
  const testFile = lines.find(line => line.startsWith('Test file: '))?.replace('Test file: ', '') || '';
  const implFile = lines.find(line => line.startsWith('Implementation file: '))?.replace('Implementation file: ', '') || '';
  const passingTests = parseInt(lines.find(line => line.startsWith('Passing tests: '))?.replace('Passing tests: ', '') || '0');
  
  // Read implementation file
  const { content: implContent } = await read({ path: implFile });
  
  // Read test file
  const { content: testContent } = await read({ path: testFile });
  
  // Run tests to verify they're passing
  const testRun = await bash({ command: `pnpm dlx vitest run ${testFile}` });
  
  // Extract current function name and implementation
  const functionNameMatch = implContent.match(/export const (\w+) =/);
  const functionName = functionNameMatch ? functionNameMatch[1] : '';
  
  // Start refactoring process
  let currentContent = implContent;
  let refactorSummary = `# Refactoring Summary\n\n## Initial Analysis\n- Function: ${functionName}\n- Passing tests: ${passingTests}\n- Recent change: ${lines.find(line => line.startsWith('Recent Green phase: '))?.replace('Recent Green phase: ', '')}\n\n`;
  
  // Check if tests are passing
  if (testRun.code !== 0) {
    return `Refactor failed: tests are not passing\n${testRun.stderr}\n${testRun.stdout}`;
  }
  
  // Add passing message
  refactorSummary += `All ${passingTests} tests are passing.\n\n`;
  
  // For now, just return the summary without making actual changes
  refactorSummary += `No refactoring performed as agent implementation is pending.\n\nThis is a placeholder response.`;
  
  return refactorSummary;
};