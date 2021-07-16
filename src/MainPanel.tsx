import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Buffer } from 'types';
import { processDataES } from './util/process';
import { ResponsiveLine } from '@nivo/line';
import { CustomSlider } from './components/CustomSlider';
import { formatMinSec } from './components/format';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{ id: string; data: Array<{ x: string; y: number }> }> | null;
  loading: boolean;
  min_duration: number;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: null,
    loading: false,
    min_duration: 0,
  };

  componentDidMount() {
    if (this.props.data.series.length > 0) {
      const { buffer } = this.props.data.series[0].fields[0].values as Buffer;
      const { data } = processDataES(buffer, 0, this.props.options.timezone);
      this.setState({ data, loading: false, min_duration: 0 });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.data.series[0] !== this.props.data.series[0]) {
      this.setState(prevState => ({ ...prevState, data: null, loading: true }));
      if (this.props.data.series.length > 0) {
        const { buffer } = this.props.data.series[0].fields[0].values as Buffer;
        const { data } = processDataES(buffer, this.state.min_duration, this.props.options.timezone);

        setTimeout(() => {
          this.setState(prevState => ({ ...prevState, data, loading: false }));
        }, 1000);
      }
    }

    if (prevState.min_duration != this.state.min_duration) {
      this.setState(prevState => ({ ...prevState, data: null, loading: true }));
      const { buffer } = this.props.data.series[0].fields[0].values as Buffer;
      const { data } = processDataES(buffer, this.state.min_duration, this.props.options.timezone);

      setTimeout(() => {
        this.setState(prevState => ({ ...prevState, data, loading: false }));
      }, 1000);
    }
  }

  onSlider = (value: number[]) => {
    if (value.length == 1) {
      this.setState({ min_duration: value[0] });
    }
  };

  render() {
    const { width, height } = this.props;
    const { data, loading, min_duration } = this.state;

    if (!data && loading) {
      return <div>Loading...</div>;
    }

    if (!data && !loading) {
      return <div>No Data</div>;
    }

    if (data) {
      return (
        <div
          style={{
            width,
            height,
          }}
        >
          <div style={{ width: '50%', margin: '0 auto' }}>
            <CustomSlider
              label="Min Duration"
              domain={[0, 1800]}
              defaultValues={[min_duration]}
              mode={1}
              step={1}
              trackRight={false}
              trackLeft={true}
              defaultTicks={[0, 600, 1200, 1800]}
              format={formatMinSec}
              setValue={this.onSlider}
            />
          </div>
          <div style={{ height: height - 30, width }}>
            <ResponsiveLine
              data={data}
              margin={{ top: 10, right: 20, bottom: 60, left: 80 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%dT%H:%M:%S',
                useUTC: false,
                // precision: 'day',
              }}
              xFormat="time:%Y-%m-%dT%H:%M:%S"
              yScale={{
                type: 'linear',
                stacked: false,
              }}
              axisLeft={{
                // legend: 'linear scale',
                tickValues: 10,
                legendOffset: 12,
              }}
              axisBottom={{
                format: '%H:%M',
                tickValues: 10,
                legend: 'time scale',
                legendOffset: -12,
              }}
              // curve={select('curve', curveOptions, 'monotoneX')}
              // enablePointLabel={true}
              // pointSymbol={CustomSymbol}
              pointSize={9}
              pointBorderWidth={1}
              pointBorderColor={{
                from: 'color',
                modifiers: [['darker', 0.3]],
              }}
              useMesh={true}
              enableSlices="y"
            />
          </div>
        </div>
      );
    }
    return <div></div>;
  }
}
