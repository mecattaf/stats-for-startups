export default function KpiSidebar({ updatedAt }) {
  // Convert ISO date to localized format
  const formattedDate = new Date(updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="mb-8">
      <label className="kpi-section-label">History</label>
      <ul>
        <li className="flex flex-col">
          <span className="font-mono">{formattedDate.split(',')[1].trim()}</span>
          <span className="font-bold">Current version</span>
          <span className="text-gray-400 text-sm">by Charge.vc</span>
        </li>
      </ul>
      
      {/* Entry Review Section */}
      <div className="mt-8">
        <a
          className="inline-block text-charge border-2 border-gray-300 text-sm font-semibold py-2 px-6 hover:border-charge hover:bg-gray-50"
          href="mailto:info@charge.vc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit a revision
        </a>
      </div>
    </div>
  )
}
