import { Stack, StackProps, SecretValue, Duration } from 'aws-cdk-lib';
import {
  aws_ecs_patterns as ecsp,
  aws_ecr_assets as ecra,
  aws_ecs as ecs,
  aws_rds as rds,
  aws_ec2 as ec2,
  aws_secretsmanager as sm } from 'aws-cdk-lib'
import { Construct } from 'constructs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dbSekret = new sm.Secret(this, 'solidus-api-testDBSecret', {
      secretName: [this.stackName, 'solidusDbPassword'].join('/'),
      generateSecretString: { passwordLength: 26 }
    })

    const vpc = new ec2.Vpc(this, 'solidus-api-testVpc')

    const db = new rds.ServerlessCluster(this, 'solidus-api-testDB', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      defaultDatabaseName: 'eks_api_prod',
      vpc,
      credentials: {
        username: "adminM3pls",
        password: SecretValue.secretsManager(dbSekret.secretArn)
      },
      scaling: {
        autoPause: Duration.minutes(10),
        minCapacity: rds.AuroraCapacityUnit.ACU_8,
        maxCapacity: rds.AuroraCapacityUnit.ACU_32,
      }
    })

    new ecsp.ApplicationLoadBalancedFargateService(this, 'solidus-api-testApp', {
      vpc,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("../"),
        containerPort: 3000,
        environment: {
          RAILS_ENV: "production",
          RAILS_MAX_THREADS: "5",
          DB_PASSWORD: SecretValue.secretsManager(dbSekret.secretArn).toString(),
          DB_USERNAME: "adminM3pls", 
          DB_HOST: db.clusterEndpoint.hostname,
          DB_PORT: db.clusterEndpoint.port.toString(),
          DB_NAME: "eks_api_prod"
        }
      }
    })
  }
}
