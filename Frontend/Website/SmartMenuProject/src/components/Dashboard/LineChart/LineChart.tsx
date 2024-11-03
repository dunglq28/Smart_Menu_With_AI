// LineChart.tsx
import { Line } from "react-chartjs-2";
import { Card, CardBody, Heading } from "@chakra-ui/react";

interface LineChartProps {
  title: string;
  data: any;
  options?: any;
}

const LineChart: React.FC<LineChartProps> = ({ title, data, options }) => {
  return (
    <Card>
      <CardBody>
        <Heading className="title_base">{title}</Heading>
        <Line data={data} options={options} />
      </CardBody>
    </Card>
  );
};

export default LineChart;
