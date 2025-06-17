import React from 'react';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import YearlyBreakup from '../components/YearlyBreakup';
import MonthlyEarnings from '../components/MonthlyEarnings';
import { Users, UserCheck, FolderOpen, Calendar, CreditCard, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <StatsCard
              title="Employees"
              value="96"
              icon={Users}
              bgColor="bg-gradient-to-br from-blue-100 to-blue-50"
              iconColor="bg-blue-500"
            />
            <StatsCard
              title="Clients"
              value="3,650"
              icon={UserCheck}
              bgColor="bg-gradient-to-br from-orange-100 to-orange-50"
              iconColor="bg-orange-500"
            />
            <StatsCard
              title="Projects"
              value="356"
              icon={FolderOpen}
              bgColor="bg-gradient-to-br from-cyan-100 to-cyan-50"
              iconColor="bg-cyan-500"
            />
            <StatsCard
              title="Events"
              value="696"
              icon={Calendar}
              bgColor="bg-gradient-to-br from-red-100 to-red-50"
              iconColor="bg-red-500"
            />
            <StatsCard
              title="Payroll"
              value="$96k"
              icon={CreditCard}
              bgColor="bg-gradient-to-br from-green-100 to-green-50"
              iconColor="bg-green-500"
            />
            <StatsCard
              title="Reports"
              value="59"
              icon={FileText}
              bgColor="bg-gradient-to-br from-purple-100 to-purple-50"
              iconColor="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div className="space-y-6">
              <YearlyBreakup />
              <MonthlyEarnings />
            </div>
          </div>
    </>
  );
};

export default Dashboard;