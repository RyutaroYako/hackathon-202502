import { Alert } from '../types';

interface AlertListProps {
  alerts: Alert[];
}

const AlertList = ({ alerts }: AlertListProps) => {
  if (alerts.length === 0) {
    return (
      <div className="card">
        <div className="p-4 text-center text-gray-500">
          No alerts at this time. All books are above their threshold levels.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="alert alert-warning">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{alert.title}</h3>
                <p className="text-sm">
                  残りの在庫数: <span className="font-medium text-red-600">{alert.stock}</span>
                  {' '}- 閾値: <span className="font-medium">{alert.threshold}</span>
                </p>
              </div>
              <div className="text-yellow-800 bg-yellow-50 px-2 py-1 rounded text-sm font-medium">
                Low Stock
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded">
        <p className="text-sm">
          <strong>注意:</strong> 在庫数が閾値以下の書籍がここに表示されています。在庫切れを避けるため、これらの商品はお早めに補充をご検討ください。
        </p>
      </div>
    </div>
  );
};

export default AlertList;