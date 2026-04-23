output "frontend_hosts" {
  description = "Frontend hosts managed by Terraform"
  value = [
    digitalocean_record.root.fqdn,
    digitalocean_record.www.fqdn,
  ]
}
