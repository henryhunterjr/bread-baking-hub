import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MethodStep {
  title: string;
  description?: string;
  instructions: string[];
  subSteps?: {
    title: string;
    content: string | string[];
  }[];
}

interface MethodStepsProps {
  steps: MethodStep[];
}

export const MethodSteps = ({ steps }: MethodStepsProps) => {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">Method</h2>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index}>
            <div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              {step.description && (
                <p className="text-muted-foreground mb-3">{step.description}</p>
              )}
              <ul className="space-y-2 ml-4">
                {step.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
              
              {step.subSteps && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {step.subSteps.map((subStep, subIdx) => (
                    <div key={subIdx}>
                      <h4 className="font-semibold mb-2">{subStep.title}</h4>
                      {typeof subStep.content === 'string' ? (
                        <p className="text-sm">{subStep.content}</p>
                      ) : (
                        <ul className="text-sm space-y-1">
                          {subStep.content.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {step.instructions.length > 1 && (
                <p className="mt-3">Perform 3 sets, with 45 minutes between each set. By the end, the dough should feel strong, elastic, and less sticky.</p>
              )}
            </div>
            
            {index < steps.length - 1 && <Separator className="mt-8" />}
          </div>
        ))}
      </div>
    </Card>
  );
};