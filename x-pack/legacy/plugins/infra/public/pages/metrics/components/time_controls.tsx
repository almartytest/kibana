/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiSuperDatePicker, OnRefreshChangeProps, OnTimeChangeProps } from '@elastic/eui';
import React, { useCallback } from 'react';
import euiStyled from '../../../../../../common/eui_styled_components';
import { MetricsTimeInput } from '../containers/with_metrics_time';
import { useKibanaUiSetting } from '../../../utils/use_kibana_ui_setting';
import { mapKibanaQuickRangesToDatePickerRanges } from '../../../utils/map_timepicker_quickranges_to_datepicker_ranges';

interface MetricsTimeControlsProps {
  currentTimeRange: MetricsTimeInput;
  isLiveStreaming?: boolean;
  refreshInterval?: number | null;
  onChangeTimeRange: (time: MetricsTimeInput) => void;
  setRefreshInterval: (refreshInterval: number) => void;
  setAutoReload: (isAutoReloading: boolean) => void;
  onRefresh: () => void;
}

export const MetricsTimeControls = (props: MetricsTimeControlsProps) => {
  const [timepickerQuickRanges] = useKibanaUiSetting('timepicker:quickRanges');
  const {
    onChangeTimeRange,
    onRefresh,
    currentTimeRange,
    isLiveStreaming,
    refreshInterval,
    setAutoReload,
    setRefreshInterval,
  } = props;

  const commonlyUsedRanges = mapKibanaQuickRangesToDatePickerRanges(timepickerQuickRanges);

  const handleTimeChange = useCallback(
    ({ start, end }: OnTimeChangeProps) => {
      onChangeTimeRange({
        from: start,
        to: end,
        interval: '>=1m',
      });
    },
    [onChangeTimeRange]
  );

  const handleRefreshChange = useCallback(
    ({ isPaused, refreshInterval: _refreshInterval }: OnRefreshChangeProps) => {
      if (isPaused) {
        setAutoReload(false);
      } else {
        setRefreshInterval(_refreshInterval);
        setAutoReload(true);
      }
    },
    [setAutoReload, setRefreshInterval]
  );

  return (
    <MetricsTimeControlsContainer>
      <EuiSuperDatePicker
        start={currentTimeRange.from}
        end={currentTimeRange.to}
        isPaused={!isLiveStreaming}
        refreshInterval={refreshInterval ? refreshInterval : 0}
        onTimeChange={handleTimeChange}
        onRefreshChange={handleRefreshChange}
        onRefresh={onRefresh}
        commonlyUsedRanges={commonlyUsedRanges}
      />
    </MetricsTimeControlsContainer>
  );
};

const MetricsTimeControlsContainer = euiStyled.div`
  max-width: 750px;
`;
