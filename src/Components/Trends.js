import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Auth, graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import { Bar } from 'react-chartjs-2';
import { ChartDataLabels } from 'chartjs-plugin-datalabels';


import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Spinner } from 'react-bootstrap'

import * as queries from '../graphql/queries';


let data = {
    labels: [],
    datasets: [{
        label: 'Accuracy',
        type:'line',
        data: [],
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        yAxisID: 'y-axis-2'
      },{
        stack: '0',
        type: 'bar',
        label: 'Correct',
        data: [],
        fill: false,
        backgroundColor: 'rgba(102,187,106,0.6)',
        borderColor: 'rgba(102,187,106,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0,230,118,0.6)',
        hoverBorderColor: 'rgba(0,230,118,1)',
        yAxisID: 'y-axis-1'
      },{
        stack: '0',
        type: 'bar',
        label: 'Wrong',
        data: [],
        fill: false,
        backgroundColor: 'rgba(255,23,68,0.6)',
        borderColor: 'rgba(255,23,68,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.6)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        yAxisID: 'y-axis-1' 
      }
    ]
  };
  
  let options = {
    responsive: true,
    tooltips: {
      mode: 'label'
    },
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [
        {
          display: true,
          stacked: true,
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          gridLines: {
            display: false
          },
          stacked: true,
          ticks: {
            min:0
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            display: false
          },
          ticks: {
            min: 0,
            max: 100,
            callback: function(value) {
                return value + "%"
            }
          },
          scaleLabel: {
            display: true,
            labelString: "Percentage"
          }
        }
      ]
    },
    plugins: {
        datalabels: {
            backgroundColor: function(context) {
                return context.dataset.backgroundColor;
            },
            borderRadius: 2,
            color: 'white',
            font: {
                weight: 'bold'
            },
            // formatter: Math.round
        }
    },
  };

class Trends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: 0,
            part: 0,
            listItems: [],
            results: [],
            username: '',
            loading: true
        };
    }

    componentDidMount() {
        // const {session, part} = this.props.match.params;
        // this.setState({session: session, part: part});

        Auth.currentAuthenticatedUser({
            bypassCache: false  
        }).then(user => {
            this.setState({username: user.username});
        });
    }

    render () {

        const Loading = () => {
            return (
                <div class="d-flex justify-content-center align-items-center">
                <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                  </div>
            );
        }

        const TrendChart = () => {
            const itemsLen = this.state.listItems.length;
            let amountMap = new Map();
            let accuracyMap = new Map();

            for (let index = itemsLen; index > 0; index --) {
                let date = this.state.listItems[index-1].date;

                let amount = amountMap.get(date);
                let accuracy = accuracyMap.get(date);

                amount = typeof amount === 'undefined'? 1:amount+1;
                accuracy = typeof accuracy === 'undefined'? 0:accuracy;
                
                accuracy = this.state.listItems[index-1].result === true? accuracy+1:accuracy;
                
                amountMap.set(date, amount);
                accuracyMap.set(date, accuracy);

                // show recent 20 days at max
                if ( amountMap.length > 20 )
                    break;
            }

            data.labels = Array.from(amountMap.keys()).reverse();
            data.datasets[0].data = Array.from(accuracyMap.keys(), 
                    x => Math.round(accuracyMap.get(x)*100/amountMap.get(x))).reverse();
            data.datasets[1].data = Array.from(accuracyMap.values()).reverse();
            data.datasets[2].data = Array.from(amountMap.keys(), x => amountMap.get(x) - accuracyMap.get(x)).reverse();

            options.scales.yAxes[1].ticks.max = Math.ceil(Math.max (...data.datasets[0].data) * 1.3/10)*10;
            options.scales.yAxes[0].ticks.max = Math.floor(Math.max (...Array.from(amountMap.values())) * 1.3);

            console.log ('amount:', amountMap);
            console.log ('accuracy:', accuracyMap);

            console.log ('data', data);

            return (
                <Container>
                    <h2>Trends Report</h2>
                    <Bar
                    data={data}
                    options={options}
                    plugins={ChartDataLabels}
                    />
                </Container>
            );
        }

        if ( this.state.listItems.length === 0 ) {

            if (this.state.username === '') {
                return (
                <Container>
                <Loading />
                </Container>);
            }

            return (
                    <Connect query={graphqlOperation(queries.queryPracticeHistories, 
                                        { "filter": { username: {eq: this.state.username}, 
                                                      tryNum: {eq: 1 }},
                                          limit: 20000
                                        })}>
                        {({ data: { listPracticeHistories }, loading, errors }) => {
                            console.log("loading: ", loading);
                            console.log("data:", listPracticeHistories);
                        if (loading || !listPracticeHistories) 
                            return (<Loading />);

                            if (errors.lenth > 0 ) return (<Container><h3>Error</h3></Container>);

                            this.state.listItems = listPracticeHistories.items;
                            console.log ('result array: ', this.state.listItems);                   
            
                            return (<TrendChart />);
                        }}
                    </Connect>
            );
        }

        return (<TrendChart />);
    }
}

export default withRouter(Trends);