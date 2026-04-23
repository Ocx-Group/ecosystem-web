# Ecosystem Web Infrastructure

## Kubernetes

Despliegue manual con `kubectl`:

```bash
kubectl apply -k Infrastructure/k8s/ecosystem-web
```

Despliegue gestionado por Argo CD:

```bash
kubectl apply -f Infrastructure/argocd/project.yaml
kubectl apply -f Infrastructure/argocd/application.yaml
```

## GitHub Actions

El deploy de producción del frontend está en `.github/workflows/deploy-prod.yml`.

Secrets requeridos en GitHub:

- `DO_TOKEN`

El workflow:

- construye y publica `registry.digitalocean.com/ocx-registry/ecosystem-web`
- asegura `AppProject` y `Application` en ArgoCD
- espera el rollout del deployment `ecosystem-web`

## Terraform

Los archivos de Terraform gestionan solo los records DNS del frontend (`@` y `www`).

```bash
cd Infrastructure/terraform
terraform init
terraform plan -var-file=environments/prod.tfvars.example
terraform apply -var-file=environments/prod.tfvars.example
```

Exporta el token como variable de entorno antes de ejecutar Terraform: `TF_VAR_do_token=...`.
