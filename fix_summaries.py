import re

# Read the file
with open('/Users/sudhir/Documents/vibe/error-saas/kubernetes/errors/k8s_errors.ts', 'r') as f:
    content = f.read()

# Find all error objects missing summary fields
pattern = r'(category: "[^"]+",)\s*\n\s*(root_causes: \[)'
matches = list(re.finditer(pattern, content))

print(f"Found {len(matches)} error objects missing summary field")

# Define summaries for canonical slugs
canonical_summaries = {
    'persistentvolumeclaimpending': 'PersistentVolumeClaim is stuck in pending state and cannot be bound to a volume.',
    'podexitsigterm': 'Pod was terminated gracefully with SIGTERM signal during shutdown.',
    'podschedulingfailed': 'Pod could not be scheduled on any available node in the cluster.',
    'portalreadyallocated': 'Port is already allocated or in use by another service.',
    'quotaexceeded': 'Resource quota limits have been exceeded in the namespace.',
    'readinessprobe': 'Readiness probe is failing, preventing pod from receiving traffic.',
    'secretnotfound': 'Referenced Kubernetes secret does not exist in the namespace.',
    'servicenotfound': 'Referenced Kubernetes service does not exist in the namespace.',
    'volumemountfailed': 'Volume failed to mount to the pod container.',
    'certificateexpired': 'TLS certificate has expired and needs renewal.',
    'clusterautoscalerfailed': 'Cluster autoscaler failed to scale nodes up or down.',
    'containercreating': 'Pod is stuck in ContainerCreating state and cannot start.',
    'contextswitchfailed': 'Failed to switch kubectl context to target cluster.',
    'corednsfailed': 'CoreDNS service is failing and DNS resolution is broken.',
    'cputhrottling': 'Container CPU usage is being throttled due to resource limits.',
    'crashloopbackoff': 'Pod is stuck in crash loop, repeatedly restarting after failures.',
    'deadlockdetected': 'Resource deadlock detected in cluster scheduling decisions.',
    'etcdfull': 'etcd cluster storage is full and cannot accept new data.',
    'failedmount': 'Volume failed to mount to container filesystem.',
    'hpanotworking': 'Horizontal Pod Autoscaler is not functioning properly.',
    'ingressnotworking': 'Ingress controller is not routing traffic to backend services.',
    'invalidyaml': 'Kubernetes manifest contains invalid YAML syntax.',
    'limitrangeviolation': 'Pod resource configuration violates namespace LimitRange constraints.',
    'namespacenotfound': 'Referenced Kubernetes namespace does not exist.',
    'podstuckpending': 'Pod remains in pending state and cannot be scheduled.',
    'rbacpermissiondenied': 'Operation denied due to insufficient RBAC permissions.',
    'startupprobefailed': 'Container startup probe is failing during initialization.'
}

# Process matches in reverse order to maintain positions
fixed_content = content
offset = 0

for match in matches:
    start_pos = match.start() + offset
    end_pos = match.end() + offset
    
    # Find the canonical_slug for this error object by looking backwards
    before_text = fixed_content[:start_pos]
    slug_matches = re.findall(r'canonical_slug: "([^"]+)"', before_text)
    
    if slug_matches:
        slug = slug_matches[-1]  # Get the most recent canonical_slug
        
        if slug in canonical_summaries:
            summary = canonical_summaries[slug]
            # Create replacement text
            replacement = f'{match.group(1)}\n    summary: "{summary}",\n    {match.group(2)}'
            
            # Apply the replacement
            fixed_content = fixed_content[:start_pos] + replacement + fixed_content[end_pos:]
            
            # Update offset for subsequent replacements
            offset += len(replacement) - len(match.group(0))

# Count remaining missing summaries
remaining_pattern = r'category: "[^"]+",\s*\n\s*root_causes: \['
remaining_matches = re.findall(remaining_pattern, fixed_content)
remaining_count = len(remaining_matches)

# Write the fixed content back
with open('/Users/sudhir/Documents/vibe/error-saas/kubernetes/errors/k8s_errors.ts', 'w') as f:
    f.write(fixed_content)

print(f"Applied fixes. Remaining missing summaries: {remaining_count}")
