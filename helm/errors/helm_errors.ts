export type HelmError = {
  tool: "helm";
  canonical_slug: string;
  title: string;
  aliases: string[];
  matchers: { regex: string[] };
  category: "chart" | "release" | "repository" | "template" | "values" | "hooks" | "install";
  summary: string;
  root_causes: {
    name: string;
    why: string;
    confidence: number;
    sources: { url: string; label: string }[];
  }[];
  fix_steps: {
    step: string;
    commands: string[];
    sources: { url: string; label: string }[];
  }[];
  clarifying_questions: string[];
  examples: {
    name: string;
    symptom: string;
    fix: string;
    sources: { url: string; label: string }[];
  }[];
  created_at: string;
  updated_at: string;
};

export const HELM_ERRORS: HelmError[] = [
  {
    tool: "helm",
    canonical_slug: "chart-not-found",
    title: "Chart Not Found",
    aliases: ["chart not found", "chart does not exist", "no chart found"],
    matchers: {
      regex: ["chart.*not.*found", "chart.*does.*not.*exist", "no.*chart.*found"]
    },
    category: "chart",
    summary: "Helm chart could not be found in the specified repository or local filesystem.",
    root_causes: [
      {
        name: "Incorrect chart name",
        why: "Chart name is misspelled or does not exist in the repository",
        confidence: 0.8,
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_search/", "label": "Helm Search"}
        ]
      },
      {
        name: "Repository not added",
        why: "Chart repository has not been added to Helm",
        confidence: 0.7,
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_repo_add/", "label": "Helm Repo Add"}
        ]
      },
      {
        name: "Repository not updated",
        why: "Local repository cache is outdated",
        confidence: 0.6,
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_repo_update/", "label": "Helm Repo Update"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Search for available charts",
        commands: ["helm search repo <chart-name>", "helm search hub <chart-name>"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_search/", "label": "Helm Search"}
        ]
      },
      {
        step: "Add repository if needed",
        commands: ["helm repo add <repo-name> <repo-url>", "helm repo update"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_repo_add/", "label": "Helm Repo Add"}
        ]
      },
      {
        step: "Update repository cache",
        commands: ["helm repo update"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_repo_update/", "label": "Helm Repo Update"}
        ]
      }
    ],
    clarifying_questions: ["What chart are you trying to install?", "Have you added the chart repository?"],
    examples: [
      {
        name: "Installing nginx chart without repository",
        symptom: "Error: failed to download chart nginx",
        fix: "Add the nginx repository first",
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_repo_add/", "label": "Helm Repo Add"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "helm",
    canonical_slug: "release-already-exists",
    title: "Release Already Exists",
    aliases: ["release already exists", "release name conflict", "name already in use"],
    matchers: {
      regex: ["release.*already.*exists", "release.*name.*conflict", "name.*already.*in.*use"]
    },
    category: "release",
    summary: "Helm release name is already in use in the current namespace.",
    root_causes: [
      {
        name: "Duplicate release name",
        why: "A release with the same name already exists in the namespace",
        confidence: 0.9,
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_list/", "label": "Helm List"}
        ]
      },
      {
        name: "Failed previous installation",
        why: "Previous installation attempt failed but left a release record",
        confidence: 0.7,
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_uninstall/", "label": "Helm Uninstall"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "List existing releases",
        commands: ["helm list", "helm list --all-namespaces"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_list/", "label": "Helm List"}
        ]
      },
      {
        step: "Use different release name or uninstall existing",
        commands: ["helm install <new-name> <chart>", "helm uninstall <existing-name>"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_install/", "label": "Helm Install"}
        ]
      }
    ],
    clarifying_questions: ["What release name are you using?", "Do you want to upgrade the existing release?"],
    examples: [
      {
        name: "Installing nginx with duplicate name",
        symptom: "Error: cannot re-use a name that is still in use",
        fix: "Use a different release name or uninstall the existing release",
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_install/", "label": "Helm Install"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    tool: "helm",
    canonical_slug: "template-error",
    title: "Template Error",
    aliases: ["template error", "template parsing error", "template syntax error"],
    matchers: {
      regex: ["template.*error", "template.*parsing.*error", "template.*syntax.*error"]
    },
    category: "template",
    summary: "Helm template contains syntax errors or invalid Go template syntax.",
    root_causes: [
      {
        name: "Invalid Go template syntax",
        why: "Template contains malformed Go template expressions",
        confidence: 0.8,
        sources: [
          {"url": "https://helm.sh/docs/chart_template_guide/", "label": "Chart Template Guide"}
        ]
      },
      {
        name: "Missing template values",
        why: "Template references values that are not defined",
        confidence: 0.7,
        sources: [
          {"url": "https://helm.sh/docs/chart_template_guide/values_files/", "label": "Values Files"}
        ]
      },
      {
        name: "Incorrect indentation",
        why: "YAML indentation is incorrect in template output",
        confidence: 0.6,
        sources: [
          {"url": "https://helm.sh/docs/chart_template_guide/yaml_techniques/", "label": "YAML Techniques"}
        ]
      }
    ],
    fix_steps: [
      {
        step: "Test template rendering",
        commands: ["helm template <release-name> <chart>", "helm install --dry-run <release-name> <chart>"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_template/", "label": "Helm Template"}
        ]
      },
      {
        step: "Check template syntax",
        commands: ["helm lint <chart>"],
        sources: [
          {"url": "https://helm.sh/docs/helm/helm_lint/", "label": "Helm Lint"}
        ]
      },
      {
        step: "Validate values file",
        commands: ["helm template <release-name> <chart> --values values.yaml"],
        sources: [
          {"url": "https://helm.sh/docs/chart_template_guide/values_files/", "label": "Values Files"}
        ]
      }
    ],
    clarifying_questions: ["What is the exact template error message?", "Are you using custom values files?"],
    examples: [
      {
        name: "Missing closing bracket in template",
        symptom: "template: deployment.yaml: template syntax error",
        fix: "Check for unclosed template expressions like {{ .Values.image.tag",
        sources: [
          {"url": "https://helm.sh/docs/chart_template_guide/", "label": "Chart Template Guide"}
        ]
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Add more helm errors here following the same pattern
// Total target: 50 helm errors