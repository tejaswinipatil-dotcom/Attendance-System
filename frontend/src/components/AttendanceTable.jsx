export default function AttendanceTable({ records }) {
  return (
    
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Role</th>
          <th>Name</th>
          <th>Type</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r, i) => (
          <tr key={i}>
            <td>{r.role}</td>
            <td>{r.name}</td>
            <td>{r.type}</td>
            <td>{r.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
