import * as cdk from 'aws-cdk-lib';
import * as Infra from '../lib/infra-stack';

test('SQS Queue and SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Infra.InfraStack(app, 'MyTestStack');
    // THEN
    const actual = JSON.stringify(app.synth().getStackArtifact(stack.artifactId).template);
    expect(actual).toContain('AWS::SQS::Queue');
    expect(actual).toContain('AWS::SNS::Topic');
});
