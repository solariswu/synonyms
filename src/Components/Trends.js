import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import { Bar } from 'react-chartjs-2';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'

import * as queries from '../graphql/queries';


let data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Accuracy',
        type:'line',
        data: [51, 65, 40, 49, 60, 37, 40],
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        yAxisID: 'y-axis-2'
      },{
        type: 'bar',
        label: 'Amount',
        data: [200, 185, 590, 621, 250, 400, 95],
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
        yAxisID: 'y-axis-1'
      }]
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
        }
      ]
    }
  };

class Trends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: 0,
            part: 0,
            listItems: [],
            results: [],
            currentIndex: 0,
            selectedOption: '',
            answered: '',
            username: '',
            sendHistory: null
        };
    }

    render () {

        const TrendChart = () => {

            return (
                <Container>
                    <h2>Trends Report</h2>
                    <Bar
                    data={data}
                    options={options}
                    />
                </Container>
            );
        }

        if ( this.state.listItems.length === 0 ) {

            return (
                    <Connect query={graphqlOperation(queries.queryPracticeHistoriesByUsernameDate, 
                                        { username: 'nomfa' })}>
                        {({ data: { queryPracticeHistoriesByUsernameDate }, loading, errors }) => {
                            console.log("loading: ", loading);
                            console.log("data:", queryPracticeHistoriesByUsernameDate);
                        if (loading || !queryPracticeHistoriesByUsernameDate) return (<h3>Loading...</h3>);
                            if (errors.lenth > 0 ) return (<h3>Error</h3>);

                            this.state.listItems = queryPracticeHistoriesByUsernameDate.items;
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