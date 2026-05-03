document.addEventListener('DOMContentLoaded', () => {
    // Endpoints for Atlassian Statuspage JSON
    const endpoints = {
        openai: 'https://status.openai.com/api/v2/status.json',
        claude: 'https://status.claude.com/api/v2/status.json',
        deepseek: 'https://status.deepseek.com/api/v2/status.json',
        github: 'https://www.githubstatus.com/api/v2/status.json',
        windsurf: 'https://status.windsurf.com/api/v2/status.json',
        cursor: 'https://status.cursor.com/api/v2/status.json'
    };

    /**
     * Maps Atlassian status indicators to our UI classes
     */
    const mapIndicatorToClass = (indicator) => {
        switch (indicator) {
            case 'none': return 'none'; // Operational
            case 'minor': return 'minor'; // Degraded/Minor Outage
            case 'major': return 'major'; // Major Outage
            case 'critical': return 'critical'; // Critical Outage
            default: return 'none';
        }
    };

    /**
     * Maps Atlassian status indicators to text color classes
     */
    const mapIndicatorToTextClass = (indicator) => {
        switch (indicator) {
            case 'none': return 'operational';
            case 'minor': return 'degraded';
            case 'major':
            case 'critical': return 'outage';
            default: return 'operational';
        }
    };

    /**
     * Fetch status and update the DOM for a specific service
     */
    const fetchStatus = async (serviceId, url) => {
        const card = document.getElementById(`card-${serviceId}`);
        const indicatorEl = card.querySelector('.status-indicator');
        const textEl = card.querySelector('.status-text');

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const { description, indicator } = data.status;

            // Remove loading state
            indicatorEl.classList.remove('loading');
            
            // Add new status class
            indicatorEl.classList.add(mapIndicatorToClass(indicator));
            
            // Update text
            textEl.textContent = description;
            textEl.className = `status-text ${mapIndicatorToTextClass(indicator)}`;
            
        } catch (error) {
            console.error(`Failed to fetch status for ${serviceId}:`, error);
            indicatorEl.classList.remove('loading');
            indicatorEl.classList.add('major'); // Show red on failure
            textEl.textContent = 'Failed to load status';
            textEl.className = 'status-text outage';
        }
    };

    // Initiate fetches
    fetchStatus('openai', endpoints.openai);
    fetchStatus('claude', endpoints.claude);
    fetchStatus('deepseek', endpoints.deepseek);
    fetchStatus('github', endpoints.github);
    fetchStatus('windsurf', endpoints.windsurf);
    fetchStatus('cursor', endpoints.cursor);
});
