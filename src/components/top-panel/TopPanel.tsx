import { topPanelTypes } from '.';
import { prepareTopPanel } from './helpers';
import { TOP_PANEL_TYPES } from './topPanelTypes';

type TopPanelProps = {
    type: TOP_PANEL_TYPES;
};

type TopPanelElement = {
    type: topPanelTypes.TOP_PANEL_TYPES;
    topPanel?: JSX.Element;
    topPanelTypes?: JSX.Element;
};

export default function TopPanel({ type }: TopPanelProps) {
    const topPanels = prepareTopPanel();

    function getTopPanelById(topPanels: TopPanelElement[], type: topPanelTypes.TOP_PANEL_TYPES) {
        return topPanels.find(topPanel => topPanel.type === type);
    }

    const topPanel: TopPanelElement = getTopPanelById(topPanels, type) as TopPanelElement;

    return (
        <>
            {topPanel && topPanel.topPanel}
        </>
    );


}

