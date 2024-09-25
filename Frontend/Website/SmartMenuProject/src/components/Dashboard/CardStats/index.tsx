import React from "react";
import { Box, SimpleGrid, Card, CardBody, Text, Heading, Icon, Grid } from "@chakra-ui/react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bgColor }) => {
  return (
    <Card>
      <CardBody>
        <Grid templateColumns="auto 1fr" alignItems="center" gap={6}>
          <Box
            bg={bgColor}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={4}
            p={6}
          >
            <Icon as={icon} boxSize={10} color="#fff" />
          </Box>
          <Box>
            <Text paddingBottom={2} fontWeight={500}>
              {label}
            </Text>
            <Heading size="md">{value}</Heading>
          </Box>
        </Grid>
      </CardBody>
    </Card>
  );
};

interface CardStatsProps {
  stats: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    bgColor: string;
  }[];
}

const CardStats: React.FC<CardStatsProps> = ({ stats }) => {
  return (
    <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          bgColor={stat.bgColor}
        />
      ))}
    </SimpleGrid>
  );
};

export default CardStats;
