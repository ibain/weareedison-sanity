<script>
console.log('Simple debug starting...');

// Test Sanity connection
fetch('https://u8cybb7l.api.sanity.io/v2023-10-01/data/query/production?query=*[_type=="slide"]')
  .then(response => response.json())
  .then(data => {
    console.log('Slides found:', data.result);
    
    // Create debug output
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: white; border: 2px solid red; padding: 20px; max-width: 400px; z-index: 9999; font-family: monospace; font-size: 12px;';
    
    if (data.result && data.result.length > 0) {
      debugDiv.innerHTML = `
        <h3>✅ Sanity Connected!</h3>
        <p>Found ${data.result.length} slides</p>
        <p>First slide: ${data.result[0].title || 'No title'}</p>
        <button onclick="this.parentElement.remove()">Close</button>
      `;
    } else {
      debugDiv.innerHTML = `
        <h3>❌ No Slides Found</h3>
        <p>Check Sanity Studio for content</p>
        <p>Response: ${JSON.stringify(data)}</p>
        <button onclick="this.parentElement.remove()">Close</button>
      `;
    }
    
    document.body.appendChild(debugDiv);
  })
  .catch(error => {
    console.error('Sanity error:', error);
    
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: white; border: 2px solid red; padding: 20px; max-width: 400px; z-index: 9999; font-family: monospace; font-size: 12px;';
    debugDiv.innerHTML = `
      <h3>❌ Sanity Error</h3>
      <p>Error: ${error.message}</p>
      <button onclick="this.parentElement.remove()">Close</button>
    `;
    document.body.appendChild(debugDiv);
  });

// Test events
fetch('https://u8cybb7l.api.sanity.io/v2023-10-01/data/query/production?query=*[_type=="event"]')
  .then(response => response.json())
  .then(data => {
    console.log('Events found:', data.result);
  })
  .catch(error => {
    console.error('Events error:', error);
  });
</script>
