import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexFill,
  ApexPlotOptions,
  ApexResponsive,
  ChartComponent,
} from 'ng-apexcharts';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts4/themes/animated';
import { EChartsOption } from 'echarts';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { ToastrService } from 'ngx-toastr';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';
import { MonthlyPurchases } from '@app/core/models/invoice-model/monthly-purchases.model';
import { MonthlyRegistrations } from '@app/core/models/user-affiliate-model/monthly-registrations.model';

am4core.useTheme(am5themes_Animated);

const MONTH_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

interface MonthlyChart {
  name: string;
  color: string;
  labels: string[];
  values: number[];
  format: (value: number) => string;
}

function buildMonthlyLineChart(chart: MonthlyChart): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => chart.format(Number(value)),
    },
    grid: {
      left: 60,
      right: 20,
      top: 20,
      bottom: 30,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: !1,
        data: chart.labels,
        axisLabel: {
          fontSize: 10,
          color: '#9aa0ac',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 10,
          color: '#9aa0ac',
        },
      },
    ],
    series: [
      {
        name: chart.name,
        type: 'line',
        smooth: !0,
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: chart.values,
      },
    ],
    color: [chart.color],
  };
}

function buildPurchasesChart(labels: string[], values: number[]): EChartsOption {
  return buildMonthlyLineChart({
    name: 'Compras',
    color: '#9f78ff',
    labels,
    values,
    format: (value) => `$${value.toFixed(2)}`,
  });
}

function buildAffiliatesChart(labels: string[], values: number[]): EChartsOption {
  return buildMonthlyLineChart({
    name: 'Afiliados',
    color: '#32cafe',
    labels,
    values,
    format: (value) => `${value}`,
  });
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
};
@Component({
    selector: 'app-home-admin',
    templateUrl: './home-admin.component.html',
    standalone: false
})
export class HomeAdminComponent implements OnInit {
  private chart: am4maps.MapChart;
  public pieChartOptions: any;
  public avgLecChartOptions: any;
  totalMembers: number;
  commissionsPaid: number;
  walletProfit: number;
  calculatedCommissions: number;
  totalReverseBalance: number;
  maps: any[] = [];
  @ViewChild('chart') chart1: ChartComponent;
  lastRegisteredUsers: UserAffiliate[] = [];
  purchases_chart: EChartsOption = buildPurchasesChart([], []);
  affiliates_chart: EChartsOption = buildAffiliatesChart([], []);

  constructor(
    private walletService: WalletService,
    private affiliateService: AffiliateService,
    private toastr: ToastrService,
    private invoiceService: InvoiceService
  ) {
    this.pieChartOptions = {
      series: [],
      chart: {},
      labels: [],
      responsive: [],
      dataLabels: {},
      legend: {},
    };
    this.getBalanceInformationAdmin();
  }

  ngOnInit() {
    this.initChartReport();
    this.loadLocations();
    this.getLastRegisteredUsers();
    this.loadPurchasesChart();
    this.loadAffiliatesChart();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  private initChartReport3() {
    this.pieChartOptions = {
      series: [
        Number(this.walletProfit),
        Number(this.totalMembers),
        Number(this.calculatedCommissions),
        Number(this.commissionsPaid),

        Number(this.totalReverseBalance),
      ],
      colors: ['#f44336', '#2196f3', '#96a2b4', '#4caf50', '#9c27b0'],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: [
        'Beneficio en billetera',
        'Total afiliados',
        'Total comisiones calculadas',
        'Total Pagado',
        'Saldo Modelo 2',
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val + '%';
              },
              plotOptions: {
                pie: {
                  expandOnClick: false,
                },
              },
            },
          },
        },
      ],
    };
  }

  private initChartReport() {
    this.avgLecChartOptions = {
      series: [
        {
          name: 'Directos',
          data: [0.5, 0, 1, 0.5, 1, 0, 0, 1, 0.2, 0.4, 1, 0],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        title: {
          text: '',
        },
      },
      yaxis: {
        title: {
          text: '',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  getBalanceInformationAdmin() {
    this.walletService.getBalanceInformationAdmin().subscribe({
      next: (value) => {
        this.totalMembers = value.data.enabledAffiliates;
        this.calculatedCommissions = value.data.calculatedCommissions;
        this.commissionsPaid = value.data.commissionsPaid;
        this.walletProfit = value.data.walletProfit;
        this.totalReverseBalance = value.data.totalReverseBalance;
        this.initChartReport3();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  setMapInfo() {
    this.chart = am4core.create('chartdiv', am4maps.MapChart);
    this.chart.geodata = am4geodata_worldLow;
    this.chart.projection = new am4maps.projections.Miller();

    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ['AQ'];
    polygonSeries.useGeodata = true;

    const imageSeries = this.chart.series.push(new am4maps.MapImageSeries());
    const imageSeriesTemplate = imageSeries.mapImages.template;
    const circle = imageSeriesTemplate.createChild(am4core.Circle);

    circle.radius = 14;
    circle.fill = am4core.color('#765cbf');
    circle.stroke = am4core.color('#B27799');
    circle.strokeWidth = 1;
    circle.nonScaling = true;

    circle.tooltipText = '[bold]{title}[/]\nCantidad: {value}';

    imageSeriesTemplate.propertyFields.latitude = 'lat';
    imageSeriesTemplate.propertyFields.longitude = 'lng';

    const centerLabel = imageSeriesTemplate.createChild(am4core.Label);
    centerLabel.text = '{value}';
    centerLabel.horizontalCenter = 'middle';
    centerLabel.verticalCenter = 'middle';
    centerLabel.fill = am4core.color('#55555');
    centerLabel.nonScaling = true;

    const data = this.maps.map((item) => item);
    imageSeries.addData(data);

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#96a2b4');
    let hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#749999');
  }

  loadLocations() {
    this.affiliateService.getTotalAffiliatesByCountries().subscribe({
      next: (value) => {
        this.maps = value.data.map((item) => ({
          title: item.Title,
          value: item.Value,
          lat: item.Lat,
          lng: item.Lng,
        }));

        this.setMapInfo();
      },
      error: () => {
        this.showError('Error');
      },
    });
  }

  loadPurchasesChart() {
    this.invoiceService.getMonthlyPurchasesSummary().subscribe({
      next: (summary: MonthlyPurchases[]) => {
        this.purchases_chart = buildPurchasesChart(
          summary.map(
            (item) =>
              `${MONTH_LABELS[item.month - 1]} ${String(item.year).slice(-2)}`
          ),
          summary.map((item) => Number(item.totalAmount))
        );
      },
      error: () => {
        this.showError('Error al cargar las compras realizadas');
      },
    });
  }

  loadAffiliatesChart() {
    this.affiliateService.getMonthlyRegistrationsSummary().subscribe({
      next: (summary: MonthlyRegistrations[]) => {
        this.affiliates_chart = buildAffiliatesChart(
          summary.map(
            (item) =>
              `${MONTH_LABELS[item.month - 1]} ${String(item.year).slice(-2)}`,
          ),
          summary.map((item) => Number(item.total)),
        );
      },
      error: () => {
        this.showError('Error al cargar los afiliados ingresados');
      },
    });
  }

  getLastRegisteredUsers() {
    this.affiliateService.getLastRegisteredAffiliates().subscribe({
      next: (value) => {
        this.lastRegisteredUsers = value.data;
      },
      error: () => {
        this.showError('Error');
      },
    });
  }
}
