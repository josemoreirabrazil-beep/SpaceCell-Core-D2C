interface AwsRegionNode {
  nodeId: string;
  region: string;
  currentConnections: number;
  maxCapacity: number;
  status: 'HEALTHY' | 'OVERLOADED';
}

export class LoadBalancer {
  private static clusters: AwsRegionNode[] = [
    { nodeId: "AWS-SA-EAST-1A", region: "São Paulo (Edge Latam)", currentConnections: 0, maxCapacity: 5000, status: 'HEALTHY' },
    { nodeId: "AWS-SA-EAST-1B", region: "São Paulo (Backup Borda)", currentConnections: 0, maxCapacity: 5000, status: 'HEALTHY' }
  ];

  static routeToNextAvailableNode(msisdn: string): string {
    const optimalNode = this.clusters.reduce((prev, curr) => 
      prev.currentConnections < curr.currentConnections ? prev : curr
    );

    optimalNode.currentConnections += 1;

    if (optimalNode.currentConnections >= optimalNode.maxCapacity) {
      optimalNode.status = 'OVERLOADED';
    }

    console.log(`⚡ [LOAD BALANCER] Tráfego da linha +55 ${msisdn} direcionado para o cluster: ${optimalNode.nodeId}`);
    return optimalNode.nodeId;
  }

  static getClusterMetrics(): AwsRegionNode[] {
    return this.clusters;
  }
}
