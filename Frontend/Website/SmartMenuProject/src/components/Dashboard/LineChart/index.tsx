// LineChart.tsx
import { Line } from "react-chartjs-2";
import { Card, CardBody, Heading } from "@chakra-ui/react";
import style from "./LineChart.module.scss";

interface LineChartProps {
  title: string;
  data: any;
  options?: any;
}

const LineChart: React.FC<LineChartProps> = ({ title, data, options }) => {
  return (
    <Card>
      <CardBody>
        <Heading className={style.title}>{title}</Heading>
        <Line data={data} options={options} />
      </CardBody>
    </Card>
  );
};

export default LineChart;
