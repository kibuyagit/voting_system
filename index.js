document.addEventListener('DOMContentLoaded', () => {
    const candidateList = document.getElementById('candidateList');
    const voteCountsElement = document.getElementById('voteCounts');
    const resultsDiv = document.getElementById('results');
    const backendUrl = 'http://127.0.0.1:5000'; 

    let candidates = [];
    let votes = {};


    async function fetchCandidates() {
        try {
            const response = await fetch(`${backendUrl}/candidates`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            candidates = await response.json();
            renderCandidates();
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
            candidateList.innerHTML = '<li class="error">Failed to load candidates.</li>';
        }
    }

    
    function renderCandidates() {
        candidateList.innerHTML = '';
        candidates.forEach(candidate => {
            const listItem = document.createElement('li');
            listItem.textContent = candidate;

            const voteButton = document.createElement('button');
            voteButton.classList.add('vote-button');
            voteButton.textContent = 'Vote';
            voteButton.addEventListener('click', () => castVote(candidate));

            listItem.appendChild(voteButton);
            candidateList.appendChild(listItem);
        });
        fetchResults(); 
    }


    async function castVote(candidate) {
        try {
            const response = await fetch(`${backendUrl}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidate }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Voting failed: ${errorData.error || 'An error occurred.'}`);
                return;
            }

            const result = await response.json();
            console.log(result.message);
            fetchResults();
        } catch (error) {
            console.error('Failed to cast vote:', error);
            alert('Failed to cast vote. Please try again.');
        }
    }

    
    async function fetchResults() {
        try {
            const response = await fetch(`${backendUrl}/results`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            votes = await response.json();
            renderVoteCounts();
        } catch (error) {
            console.error('Failed to fetch results:', error);
            voteCountsElement.innerHTML = '<li class="error">Failed to load vote counts.</li>';
        }
    }


    function renderVoteCounts() {
        voteCountsElement.innerHTML = '';
        const sortedVotes = Object.entries(votes).sort(([, a], [, b]) => b - a);
        sortedVotes.forEach(([candidate, count]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${candidate}: ${count} votes`;
            voteCountsElement.appendChild(listItem);
        });
    }

    
    fetchCandidates();
});