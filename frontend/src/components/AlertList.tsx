import { Alert } from '../types';
import { FaBell, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface AlertListProps {
  alerts: Alert[];
}

const AlertList = ({ alerts }: AlertListProps) => {
  if (alerts.length === 0) {
    return (
      <div className="card">
        <div className="p-4 text-center text-gray-500 flex flex-col items-center">
          <FaInfoCircle className="text-blue-500 mb-2" size={24} />
          <p>現在アラートはありません。すべての書籍は閾値を上回っています。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaBell className="mr-2 text-yellow-500" size={20} /> 在庫不足アラート
      </h2>
      <div className="space-y-4 rounded-lg overflow-hidden shadow-lg">
        {alerts.map(alert => (
          <div key={alert.id} className="alert alert-warning rounded-lg border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{alert.title}</h3>
                <p className="text-sm">
                  残りの在庫数: <span className="font-medium text-red-600">{alert.stock}</span>
                  {' '}- 閾値: <span className="font-medium">{alert.threshold}</span>
                </p>
              </div>
              <div className="text-yellow-800 bg-yellow-50 px-2 py-1 rounded text-sm font-medium flex items-center">
                <FaExclamationTriangle className="mr-1" /> 在庫不足
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg border-l-4 border-blue-500 shadow">
        <p className="text-sm flex items-start">
          <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>
            <strong>注意:</strong> 在庫数が閾値以下の書籍がここに表示されています。在庫切れを避けるため、これらの商品はお早めに補充をご検討ください。
          </span>
        </p>
      </div>
    </div>
  );
};

export default AlertList;