import groupBy from 'lodash.groupby';

export default (config, xScale) => selection => {
    const {
        drop: {
            color: dropColor,
            radius: dropRadius,
            date: dropDate,
            onClick,
            onMouseOver,
            onMouseOut,
        },
    } = config;

    const getDropRadius = dropCount => Math.sqrt(dropCount) * dropRadius;

    const consolidateOverlappingDrops = xScale => d => {
        // consolidates nearby drops by combining their area
        const groups = groupBy(d.data, data =>
            Math.round(xScale(dropDate(data)))
        );
        return Object.values(groups).map(group => ({
            object: group[0],
            date: dropDate(group[0]),
            radius: getDropRadius(group.length),
        }));
    };

    const drops = selection
        .selectAll('.drop')
        .data(consolidateOverlappingDrops(xScale));

    drops
        .enter()
        .append('circle')
        .classed('drop', true)
        .on('click', d => onClick(d.object))
        .on('mouseover', d => onMouseOver(d.object))
        .on('mouseout', d => onMouseOut(d.object))
        .merge(drops)
        .attr('r', drop => drop.radius)
        .attr('fill', dropColor)
        .attr('cx', d => xScale(d.date));

    drops
        .exit()
        .on('click', null)
        .on('mouseover', null)
        .on('mouseout', null)
        .remove();
};
