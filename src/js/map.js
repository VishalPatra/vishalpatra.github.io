import { mountains } from './mountains.js';

export class MountainMap {
    constructor() {
        this.mapboxToken = 'pk.your_actual_mapbox_token_here'; // Replace this
        this.map = null;
        this.markers = [];
        this.activeMarker = null;
    }

    init() {
        mapboxgl.accessToken = this.mapboxToken;
        
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [85, 28], // Centered on Himalayan region
            zoom: 5
        });

        this.map.addControl(new mapboxgl.NavigationControl());
        
        this.map.on('load', () => {
            this.addMarkers();
        });
    }

    addMarkers() {
        mountains.forEach(mountain => {
            // Create marker element
            const el = document.createElement('div');
            el.className = 'mountain-marker';
            
            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${mountain.name}</h3><p>${mountain.height}m</p>`);

            // Create marker
            const marker = new mapboxgl.Marker(el)
                .setLngLat(mountain.coordinates)
                .setPopup(popup)
                .addTo(this.map);

            // Add click event
            el.addEventListener('click', () => {
                this.showMountainInfo(mountain);
                if (this.activeMarker) {
                    this.activeMarker.classList.remove('active');
                }
                el.classList.add('active');
                this.activeMarker = el;
            });

            this.markers.push(marker);
        });
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