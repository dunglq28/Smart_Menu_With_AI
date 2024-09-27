// BarChart.tsx
import { Bar } from "react-chartjs-2";
import { Card, CardBody, Heading } from "@chakra-ui/react";
import style from "./BarChart.module.scss";

interface BarChartProps {
  title: string;
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ title, data, options }) => {
  return (
    <Card>
      <CardBody>
        <Heading className={style.title}>{title}</Heading>
        <Bar data={data} options={options}/>
      </CardBody>
    </Card>
  );
};

export default BarChart;
