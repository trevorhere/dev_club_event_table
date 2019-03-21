import React, { Component } from "react";
import "./App.css";
import { Table, Button } from "react-materialize";

const key = `AIzaSyBhoqx72yFN_cuZPr_QOzp381Fdy9rawSk`;
const link = `1Z--Fc487YWBpSuJRt2Nq-7wx14XAaZFWfFUbByBoSVY`;
const API = `https://sheets.googleapis.com/v4/spreadsheets/${link}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${key}`;
const contributors = require("./assets/contributors");

class App extends Component {
  constructor() {
    super();

    this.state = {
      items: []
    };
  }

  componentDidMount() {
    fetch(API)
      .then(response => response.json())
      .then(data => {
        let batchRowValues = data.valueRanges[0].values;

        const rows = [];
        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
        }

        this.setState({ items: rows });
        // ---  dont remove ----
        console.log(this.state.items);
        console.log(contributors);
        // --------------------
      });
  }

  render() {
    const items = this.state.items
      .sort((itemY, itemX) => {
        // sorts events by date, earliest event comes first
        itemX = new Date(itemX.Date);
        itemY = new Date(itemY.Date);
        return itemX > itemY ? -1 : itemX < itemY ? 1 : 0;
      })
      .filter(item => {
        // filters out past events
        if (new Date(item.Date) > new Date()) {
          return item;
        }
      })
      .map((
        item,
        i // build table row
      ) => (
        <tr key={i}>
          <td>{item.Presenter}</td>
          <td>{item.Company}</td>
          <td>{item.Description}</td>
          <td>{item.Date}</td>
        </tr>
      ));

    return (
      <div className={"block"}>
        <h3>BYU Dev Club Upcoming Events</h3>
        <Table bordered hoverable responsive>
          <thead>
            <tr>
              <th data-field="id">Presenter</th>
              <th data-field="id">Company</th>
              <th data-field="price">Description</th>
              <th data-field="price">Date</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </Table>
        <Button
          href="http://dev.byu.edu"
          large
          node="a"
          className="back_button"
          waves="light"
        >
          Back
        </Button>
      </div>
    );
  }
}

export default App;
