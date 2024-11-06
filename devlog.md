# DEVLOG

This is a place where I can write my thoughts during the app development.

The log will go in reverse chronological order (latest first).

Disclaimer: I'm happy to version control this as it's a personal project but in 
practice/production I would not publically publish this potentially sensitive 
information.

## Fri 8th Nov

### Running Terraform

Running `terraform apply` now successfully provisioned an EC2 instance in the cloud.

Running `terraform destroy` successfully destroyed the EC2 instance:

```log
aws_instance.app_server: Destruction complete after 53s
```

### Creating Postgres DB

Now I'm moving onto actually provisioning the infrastructure I would like to use. A postgres DB
in the cloud. I'm opting to use AWS RDS to deploy the postgres DB but from this page https://aws.amazon.com/rds/faqs/#free-tier it looks to be possible to also use an EC2 Relational Database AMI. It is still not clear to me from the FAQ answer what the real difference is. I see that RDS offloads database administration but
I'm confused by that. Surely I would still be managing the database myself?

> When would I use Amazon RDS vs. Amazon EC2 Relational Database AMIs?
>
> Amazon Web Services provides a number of database alternatives for developers. Amazon RDS enables you to run a fully managed and fully featured relational database while offloading database administration. Using one of our many relational database AMIs on Amazon EC2 allows you to manage your own relational database in the cloud. There are important differences between these alternatives that may make one more appropriate for your use case. See Cloud Databases with AWS for guidance on which solution is best for you.

I cannot use version `13.4` of postgres:

```log
│ Error: creating RDS DB Instance (terraform-20241108190621095100000001): operation error RDS: CreateDBInstance, https response error StatusCode: 400, RequestID: 40d596a5-894d-4563-88d7-693ecb35dbf5, api error InvalidParameterCombination: Cannot find version 13.4 for postgres
```

Also couldn't use the db user name `admin`.

Ran this command to find that the default postgres version that will be installed is `16.3`:

```bash
aws rds describe-db-engine-versions --default-only --engine postgres
```

I have successfully created a postgres DB RDS instance in AWS with terraform!

```log
aws_db_instance.postgres: Creation complete after 5m2s [id=db-ONSYUMTQRPMNGTLJGHQUA4DW7E]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

db_instance_endpoint = "terraform-20241108191356213700000001.cpzvybhopwhq.us-west-2.rds.amazonaws.com:5432"
db_instance_id = "db-ONSYUMTQRPMNGTLJGHQUA4DW7E"
```

## Thu 7th Nov

### Terraform Setup

Created an organisation called `df-personal` here: https://app.terraform.io/app/df-personal.

Created a project called `Time Tracker` and workspace called `time-tracker`.

Ran `terraform login` and generated a token to login on the CLI.

Created `cloud-integration.tf` which defines my cloux organisation and links to the `time-tracker` project.

Re-ran `terraform init` and noticed it has added the environment details.

I still have not yet run `terraform apply`.

Going through this tutorial before generating any infrastructure:
https://developer.hashicorp.com/terraform/tutorials/aws-get-started

Ran `terraform -install-autocomplete`.

- Format `.tf` files with `terraform fmt`
- Validate with `terraform validate`

Running `terraform plan` failed because:

```log
│ Error: failed to refresh cached credentials, no EC2 IMDS role found,
│ operation error ec2imds: GetMetadata, request canceled, context deadline
│ exceeded
```

Spending quite a lot of time getting this error repeatedly. Somehow it seems that the credentials are
not valid.

```log
│ Error: No valid credential sources found
```

So, it appears the problem was that due to the `cloud-integration.tf` file I was specifying to use the terraform cloud
and though the AWS credentials were available locally, I had not configured them in the terraform cloud. For now I will 
proceed using terraform locally.

Finally running `terraform apply` with the tutorial infrastructure which should provision an EC2 instance.

Because I changed the AWS region from `us-west-2` to `eu-west-2` I have to find and change the `AMI` (Amazon Machine Image) 
specified to avoid this error:

```log
NotFound: The image id '[ami-830c94e3]' does not exist
```

Asked ChatGPT and it suggested `ami-f976839e` for `eu-west-2`.

Actually, ran into weird blocked account when trying to use `eu-west-2` so just going to revert to using `us-west-2` for simplicity.

How frustrating. My AWS has been blocked and I have now opened a support ticket with AWS to unblock my account. That means I can't actually proceed with instantiating infrastructure right now. How annoying:

```log
aws_instance.app_server: Creating...
╷
│ Error: creating EC2 Instance: operation error EC2: RunInstances, https response error StatusCode: 400, RequestID: 96ed64c8-a7eb-4dcc-aec9-dd76fa98b6af, api error Blocked: This account is currently blocked and not recognized as a valid account. Please contact https://support.console.aws.amazon.com/support/home?region=us-east-1#/case/create?issueType=customer-service&serviceCode=account-management&categoryCode=account-verification if you have questions.
│ 
```

I'm gonna stop for the day. Spent 2hr20m trying to just instantiate some AWS infrastructure with (and without) terraform. Sigh. It would be nice
to actually do some app development. Oh well, we solider on. We will get there.


## Wed 6th Nov

### Deployment

I am currently tackling deploying a postgres DB to the cloud. I am experimenting with using Terraform to deploy a free-tier 12-month
AWS RDS DB on-demand compute unit. I just want something that I can forget about and won't kill me with fees at the end of the 12-month 
period. It looks like a `db.t3.micro` instance would cost 1.09 USD per month if it is used 2/24 hours a day. I think that might be realistic?

For now, I am going to carry on.

I need to make a note that on Nov 6th 2025 the DB will start incurring costs.

I created the `deployment` directory and then ran `terraform init` within. I added `.terraform` to the `.gitignore`. The `.terraform.lock.hcl` file 
has the required information that would mean `terraform init` uses the same provider version. In practice this is only one aws provider. I could
commit `.terraform` but to keep things smaller I decided not to.

In future I might move the `deployment` out to it's own repo but in the interest of development speed, I've kept it all in once repo.

I also looked into Supabase which seemed like a good option for my needs but since my new job will be using AWS I thought it a good opportunity
to familiarise myself with more of AWS's idiosyncrasies.

#### Progress

I created the `main.tf` and `variables.tf` files with the help of ChatGPT. The goal of these files being to create and then manage the RDS postgres instance in AWS.

So I created new credentials in AWS. I just created a key for my root user as I'm only using this for development. In practice
the recommended route is via IAM Identify Center.

I added these credentials with `aws configure`.

This now means that `terraform plan` works and shows what would be created when running `terraform create` which is where I should probably 
start next development session.