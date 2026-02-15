export const extractExecutiveStatement = (text: string): string => {
  const match = text.match(/Executive Statement:|Leadership Vision:|Vision Statement:|Strategic Direction/i);
  return match ? match[0].replace(/Executive Statement:|Leadership Vision:|Vision Statement:|Strategic Direction/i, '').trim() : 'Not found';
};

export const extractCorporateObjectives = (text: string): Array<{ title: string; description: string }> => {
  const objectives: Array<{ title: string; description: string }> = [];
  const objectiveRegex = /Objective\s\d+:\s*(.*?)\s*Description:\s*(.*?)(?=\nObjective\s\d+:|$)/gis;
  
  let match;
  while ((match = objectiveRegex.exec(text)) !== null) {
    objectives.push({
      title: match[1].trim(),
      description: match[2].trim()
    });
  }
  
  return objectives;
};

export const extractNationalPolicyAlignment = (text: string): string[] => {
  const alignments: string[] = [];
  const alignmentRegex = /National Policy Alignment:|Framework Alignment:|Strategic Alignment:/i;
  
  const match = text.match(alignmentRegex);
  if (match) {
    const alignmentText = text.substring(match.index!);
    const policies = alignmentText.split(/,\s*|\n/).filter(line => 
      line.match(/National Policy|Framework|Strategic|Alignment/i)
    );
    
    return policies.map(policy => policy.replace(/National Policy Alignment:|Framework Alignment:|Strategic Alignment:/i, '').trim());
  }
  
  return alignments;
};