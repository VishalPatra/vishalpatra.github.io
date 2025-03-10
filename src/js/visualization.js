import { mountains } from './mountains.js';

export class MountainVisualization {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.margin = { top: 40, right: 20, bottom: 40, left: 60 };
        this.svg = null;
        this.activeElement = null;
    }

    init() {
        const container = document.getElementById('mountain-viz');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        // Create SVG
        this.svg = d3.select('#mountain-viz')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Sort mountains by height
        const sortedMountains = [...mountains].sort((a, b) => b.height - a.height);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(sortedMountains.map(d => d.name))
            .range([this.margin.left, this.width - this.margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([7800, d3.max(sortedMountains, d => d.height)])
            .range([this.height - this.margin.bottom, this.margin.top]);

        // Create axes
        const xAxis = d3.axisBottom(xScale)
            .tickSize(0);

        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d => `${d}m`);

        // Add axes
        this.svg.append('g')
            .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .style('fill', '#fff');

        this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},0)`)
            .call(yAxis)
            .selectAll('text')
            .style('fill', '#fff');

        // Create mountain shapes
        const mountainGroup = this.svg.append('g')
            .attr('class', 'mountains');

        mountainGroup.selectAll('path')
            .data(sortedMountains)
            .enter()
            .append('path')
            .attr('class', 'mountain')
            .attr('d', d => {
                const x = xScale(d.name);
                const width = xScale.bandwidth();
                const y = yScale(d.height);
                const baseY = yScale(7800);
                
                return `
                    M ${x} ${baseY}
                    L ${x + width/2} ${y}
                    L ${x + width} ${baseY}
                    Z
                `;
            })
            .style('fill', '#2ecc71')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .style('fill', '#3498db');
            })
            .on('mouseout', (event, d) => {
                if (event.currentTarget !== this.activeElement) {
                    d3.select(event.currentTarget)
                        .style('fill', '#2ecc71');
                }
            })
            .on('click', (event, d) => {
                if (this.activeElement) {
                    d3.select(this.activeElement)
                        .style('fill', '#2ecc71');
                }
                this.activeElement = event.currentTarget;
                d3.select(this.activeElement)
                    .style('fill', '#3498db');
                this.showMountainInfo(d);
            });

        // Add labels
        mountainGroup.selectAll('text')
            .data(sortedMountains)
            .enter()
            .append('text')
            .attr('x', d => xScale(d.name) + xScale.bandwidth()/2)
            .attr('y', d => yScale(d.height) - 10)
            .text(d => `${d.height}m`)
            .attr('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '12px');

        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Update visualization size on window resize
        const container = document.getElementById('mountain-viz');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        // Update scales and redraw elements...
    }

    showMountainInfo(mountain) {
        const infoContent = document.querySelector('.info-content');
        infoContent.innerHTML = `
            <h3>${mountain.name}</h3>
            <div class="mountain-details">
                <img src="${mountain.image}" alt="${mountain.name}">
                <div class="details">
                    <p><strong>Height:</strong> ${mountain.height}m</p>
                    <p><strong>Location:</strong> ${mountain.location}</p>
                    <p><strong>First Ascent:</strong> ${mountain.firstAscent}</p>
                    <p><strong>First Ascent Team:</strong> ${mountain.firstAscentTeam}</p>
                </div>
            </div>
            <p class="description">${mountain.description}</p>
        `;
    }
} 