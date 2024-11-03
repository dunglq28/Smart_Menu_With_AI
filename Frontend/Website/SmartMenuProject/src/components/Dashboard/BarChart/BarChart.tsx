// BarChart.tsx
import { Bar } from "react-chartjs-2";
import { Card, CardBody, Heading } from "@chakra-ui/react";

interface BarChartProps {
  title: string;
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ title, data, options }) => {
  return (
    <Card>
      <CardBody>
        <Heading className="title_base">{title}</Heading>
        <Bar data={data} options={options} />
      </CardBody>
    </Card>
  );
};

export default BarChart;
