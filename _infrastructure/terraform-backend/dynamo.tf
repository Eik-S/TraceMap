resource "aws_dynamodb_table" "terraform_locks" {
  name         = "eike-terraform_tf_lockid"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
