import AbstractSmartComponent from "./abstact-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {typeItemsActivity} from "../const";
import {formatTimeDiff} from "../utils/time";

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
       <h2 class="visually-hidden">Trip statistics</h2>

       <div class="statistics__item statistics__item--money">
         <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
       </div>

       <div class="statistics__item statistics__item--transport">
         <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
       </div>

       <div class="statistics__item statistics__item--time-spend">
         <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
       </div>
    </section>`
  );
};

const createChartTemplate = (ctx, data, formatter, title) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      bullet: `https://www.amcharts.com/lib/images/faces/A04.png`,
      labels: data.map((it) => {
        return it[0].toUpperCase();
      }),
      datasets: [{
        data: data.map((it) => {
          return it[1];
        }),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter
        }
      },
      title: {
        display: true,
        text: title.toUpperCase(),
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const moneyChart = (moneyCtx, data) => {
  const formatter = (val) => `€ ${val}`;
  createChartTemplate(moneyCtx, data, formatter, `money`);
};

const transportChart = (transportCtx, data) => {
  const formatter = (val) => `${val}x`;
  createChartTemplate(transportCtx, data, formatter, `transport`);
};

const timeChart = (timeCtx, data) => {
  const formatter = (val) => `${formatTimeDiff(val)}`;
  createChartTemplate(timeCtx, data, formatter, `time spent`);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();
    this._eventsModel = eventsModel;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  getElement() {
    const element = super.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    moneyChart(moneyCtx, this._getMoneyTotal());
    transportChart(transportCtx, this._getTransportTotal());
    timeChart(timeSpendCtx, this._getTimeTotal());

    return element;
  }

  _getData(cb) {
    const reducer = (sum, event) => {
      const type = event.type;
      if (!sum.has(type)) {
        sum.set(type, 0);
      }
      sum.set(type, sum.get(type) + cb(event));

      if (cb(event) === true) {
        typeItemsActivity.forEach((it) => {
          sum.delete(it.toString().toLowerCase());
        });
      }

      return sum;
    };
    const events = this._eventsModel.getEvents();
    return Array.from(events.reduce(reducer, new Map())).sort((a, b) => {
      return b[1] - a[1];
    });
  }

  _getMoneyTotal() {
    return this._getData((event) => {
      return +event.price;
    });
  }

  _getTransportTotal() {
    return this._getData(() => {
      return true;
    });
  }

  _getTimeTotal() {
    return this._getData((event) => {
      return event.endDate - event.startDate;
    });
  }

  show() {
    super.show();

    this.rerender(this._eventsModel);
  }

  recoveryListeners() {}
}
