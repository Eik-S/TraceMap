resource "aws_dynamodb_table" "tracemap_sessions" {
  name         = "tracemap-sessions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "sessionID"

  attribute {
    name = "sessionID"
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = "expirationTimestamp"
  }
}
