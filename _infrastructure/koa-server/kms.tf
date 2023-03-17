resource "aws_kms_key" "tracemap_api" {
  description = "key to en-/decrypt tracemap-api secrets"
}

resource "aws_kms_alias" "tracemap_api" {
  name          = "alias/tracemap-api"
  target_key_id = aws_kms_key.tracemap_api.key_id
}
