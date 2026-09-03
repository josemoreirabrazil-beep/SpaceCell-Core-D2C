interface Franchise {
  id: string;
  regionCode: string;
  licenseKey: string;
  status: 'ACTIVE' | 'SUSPENDED';
  monthlyRevenueBrl: number;
}

export class FranchiseManager {
  private static franchises: Franchise[] = [
    { id: "FRANQ-BA-73", regionCode: "DDD-73", licenseKey: "KEY-VIVO-5G-SPACE-73", status: "ACTIVE", monthlyRevenueBrl: 15000.00 }
  ];

  static verifyLicense(licenseKey: string): boolean {
    const franchise = this.franchises.find(f => f.licenseKey === licenseKey);
    return franchise ? franchise.status === 'ACTIVE' : false;
  }

  static getNetworkRevenue(): number {
    return this.franchises.reduce((acc, current) => acc + current.monthlyRevenueBrl, 0);
  }
}
