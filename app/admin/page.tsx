export default function AdminPage() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Admin Dashboard</h1>
      <p>This is the admin page with global header.</p>
      <p>This route should inherit the header from root layout.</p>
      <style>{`
        body { margin: 0; }
      `}</style>
    </div>
  )
}