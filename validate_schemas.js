const { K8S_ERRORS } = require('./kubernetes/errors/k8s_errors.ts');

console.log('Schema validation test:');
console.log(`Total K8s errors: ${K8S_ERRORS ? K8S_ERRORS.length : 'undefined'}`);

// Count by category
if (K8S_ERRORS) {
  const categories = {};
  K8S_ERRORS.forEach(error => {
    categories[error.category] = (categories[error.category] || 0) + 1;
  });
  console.log('Categories:', categories);
  
  // Check for required fields
  const missingFields = K8S_ERRORS.filter(error => 
    !error.canonical_slug || !error.title || !error.summary || 
    !error.root_causes || !error.fix_steps || !error.examples
  );
  console.log(`Errors with missing fields: ${missingFields.length}`);
  
  // Check for duplicates
  const slugs = K8S_ERRORS.map(e => e.canonical_slug);
  const uniqueSlugs = new Set(slugs);
  console.log(`Unique slugs: ${uniqueSlugs.size} (total: ${slugs.length})`);
}