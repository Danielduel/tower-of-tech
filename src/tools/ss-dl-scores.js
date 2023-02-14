(
    async () => {
        const match = document.location.href.match('^https://scoresaber.com/u/([0-9]+)');
        if (!match?.[1]) {
            console.error('Player ID not found. Go to profile page.');
            return;
        }

        const playerId = match[1];

        const difficulties = {
            1: 'easy',
            3: 'normal',
            5: 'hard',
            7: 'expert',
            9: 'expert+'
        }

        const fetchPage = async (playerId, page = 1, itemsPerPage = 100) => (await (await fetch(`https://scoresaber.com/api/player/${playerId}/scores?limit=${itemsPerPage}&page=${page}`)).json())
            ?.playerScores?.map(s => ({
				leaderboardId: s?.leaderboard?.id ?? 0,
                songName: s?.leaderboard?.songName ?? 'unknown',
                mapper: s?.leaderboard?.levelAuthorName ?? 'unknown',
                difficulty: difficulties?.[s?.leaderboard?.difficulty?.difficulty ?? 'unknown'],
                pp: s?.score?.pp ?? 0,
                weight: s?.score?.weight ?? 0,
                acc: s?.leaderboard?.maxScore && s?.score?.baseScore ? s.score.baseScore / s.leaderboard.maxScore * 100 : 0,
            }))
            .filter(s => s.pp)
			//.filter(s => [293604, 273126].includes(s.leaderboardId)) // uncomment to filter by map
        ;

        const download = (data, filename) => {
            const link = document.createElement("a");
            if (link.download === undefined) return false;

            const blob = new Blob([data], {type: "text/csv"});

            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        }

        try {
            let scores = [];
            let allScoresFetched = false;
            let page = 1;
            const itemsPerPage = 100;
            while (!allScoresFetched) {
                console.log(`Downloading page #${page}`)
                const scoresPage = await fetchPage(playerId, page++, itemsPerPage);
                scores = [...scores, ...scoresPage];

                allScoresFetched = scoresPage.length < itemsPerPage;
            }

           const csv = "Id,Song,Mapper,Difficulty,PP,Weight,Acc\n" + scores.map(s => `${s.leaderboardId},"${s.songName.replaceAll('"', '""')}","${s.mapper.replaceAll('"', '""')}",${s.difficulty},${s.pp},${s.weight},${s.acc}`).join('\n');

           download(csv, `${playerId}-scores-export.csv`);
        } catch (e) {
            console.error("Error has occurred", e);
        }
    }
)();
