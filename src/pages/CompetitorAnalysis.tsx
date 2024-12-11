import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { CompetitorMetrics } from '../components/competitor/CompetitorMetrics';
import { ContentGapAnalysis } from '../components/competitor/ContentGapAnalysis';
import { MarketShareChart } from '../components/competitor/MarketShareChart';

export const CompetitorAnalysis = () => {
  return (
    <DashboardLayout 
      title="Competitor Analysis"
      actions={
        <button className="btn-primary">Add Competitor</button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CompetitorMetrics />
        <MarketShareChart />
        <ContentGapAnalysis />
      </div>
    </DashboardLayout>
  );
}; 