import React, { useState, useEffect } from "react";
import Error from "./ErrorMessage";
import styled from "styled-components";
import debounce from "lodash.debounce";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Images from "./Images";
import Select from "react-select/";

const ALL_TEAMS_QUERY = gql`
  query ALL_TEAMS_QUERY {
    teams {
      name
    }
  }
`;

const TEAM_QUERY = gql`
  query TEAM_QUERY($name: String!) {
    team(where: { name: $name }) {
      id
      name
      players {
        id
        summonerName
        matches {
          id
          duration
          stats {
            player {
              id
              summonerName
            }
            damage
            gold
            kills
            deaths
            assists
          }
        }
        stats {
          id
          champion
        }
      }
    }
  }
`;

const Container = styled.div`
  display: grid;
  background: violet;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  grid-gap: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  background: blue;
  background: ${props => props.color};
`;

const KDAGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  background: red;
  grid-template-columns: repeat(3, minmax(15px, 1fr));
`;

const ChampionGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  background: green;
  grid-template-columns: repeat(2, minmax(15px, 1fr));
`;

const Box = styled.div`
  width: 100%;
  padding: 10px;
  margin: 2px;
`;

function ViewTeam() {
  const [selectableTeams, setSelectableTeams] = useState([]);
  const [selectablePlayers, setSelectablePlayers] = useState([
    { value: "Summoner One" },
    { value: "Summoner Two" },
    { value: "Summoner Three" },
    { value: "Summoner Four" },
    { value: "Summoner Five" },
  ]);
  const [creatableTeamValue, setCreatableTeamValue] = useState("");
  const [teamName, setTeamName] = useState("");
  const [topThree, setTopThree] = useState({
    ["Summoner One"]: {
      ["x"]: 0,
    },
    ["Summoner Two"]: {
      ["x"]: 0,
    },
    ["Summoner Three"]: {
      ["x"]: 0,
    },
    ["Summoner Four"]: {
      ["x"]: 0,
    },
    ["Summoner Five"]: {
      ["x"]: 0,
    },
  });
  const [stats, setStats] = useState({
    ["Summoner One"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Two"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Three"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Four"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Five"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
  });

  //Queries
  const { loading, data } = useQuery(TEAM_QUERY, {
    variables: { name: teamName },
  });
  const { data: allTeamNames } = useQuery(ALL_TEAMS_QUERY);

  useEffect(() => {
    topChampions();
    getStats();
    getPlayers();
  }, [data]);

  useEffect(() => {
    let teamsArray = [];
    for (let i in allTeamNames.teams) {
      teamsArray.push({
        value: allTeamNames.teams[i].name,
        label: allTeamNames.teams[i].name,
      });
    }
    setSelectableTeams(teamsArray);
  }, [allTeamNames]);

  const getPlayers = () => {
    let playersArray = [];
    let teamPlayersArray = [];
    if (data.team) {
      for (let player in Object.keys(data.team.players)) {
        playersArray.push({
          value: data.team.players[player]["summonerName"],
          label: data.team.players[player]["summonerName"],
        });
        teamPlayersArray.push(data.team.players[player]["summonerName"]);
      }
      setSelectablePlayers(playersArray);
    }
  };

  const getStats = () => {
    let playerStats = {};
    if (data.team) {
      for (let player in Object.keys(data.team.players)) {
        let playerID = data.team.players[player]["id"];
        for (let match in Object.keys(data.team.players[player]["matches"])) {
          let totalGold = 0,
            totalDamage = 0,
            totalDuration = 0,
            kills = 0,
            deaths = 0,
            assists = 0;
          let game = data.team.players[player]["matches"][match];
          for (let stat in Object.keys(game["stats"])) {
            if (playerID === game["stats"][stat]["player"]["id"]) {
              totalGold += game["stats"][stat]["gold"];
              totalDamage += game["stats"][stat]["damage"];
              kills += game["stats"][stat]["kills"];
              deaths += game["stats"][stat]["deaths"];
              assists += game["stats"][stat]["assists"];
              totalDuration += game["duration"];
            }
          }
          totalDuration = totalDuration / 60;
          playerStats = {
            ...playerStats,
            [data.team.players[player]["summonerName"]]: {
              ["gpm"]: totalGold / totalDuration,
              ["dpm"]: totalDamage / totalDuration,
              ["kda"]: (kills + deaths) / assists,
            },
          };
        }
      }
      setStats(playerStats);
    } else {
      setStats({
        ["Summoner One"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Two"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Three"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Four"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Five"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
      });
    }
  };

  const topChampions = () => {
    let champions = {};
    if (data.team) {
      for (let player in Object.keys(data.team.players)) {
        for (let [key] in Object.keys(data.team.players[player]["stats"])) {
          let champion = data.team.players[player]["stats"][key]["champion"];
          let summoner = data.team.players[player]["summonerName"];
          if (champions[summoner] && champions[summoner][champion]) {
            champions = {
              ...champions,
              [summoner]: {
                [champion]: champions[summoner][champion] + 1,
              },
            };
          } else if (champions[summoner]) {
            champions = {
              ...champions,
              [summoner]: {
                ...champions[summoner],
                [champion]: 1,
              },
            };
          } else {
            champions = {
              ...champions,
              [summoner]: {
                [champion]: 1,
              },
            };
          }
        }
      }
    } else {
      champions = {
        ["Summoner One"]: {
          ["x"]: 0,
        },
        ["Summoner Two"]: {
          ["x"]: 0,
        },
        ["Summoner Three"]: {
          ["x"]: 0,
        },
        ["Summoner Four"]: {
          ["x"]: 0,
        },
        ["Summoner Five"]: {
          ["x"]: 0,
        },
      };
    }

    setTopThree(champions);
  };

  return (
    <>
      <Select
        isClearable
        value={creatableTeamValue}
        onChange={option => {
          setTeamName(option.value);
          setCreatableTeamValue(option);
        }}
        options={selectableTeams}
        placeholder={"Select Team. . ."}
        closeMenuOnSelect={true}
        hideSelectedOptions={true}
      />
      <Container>
        {selectablePlayers.slice(0, 5).map((player, val) => (
          <Row key={player.value}>
            <Select
              value={selectablePlayers[val]}
              onChange={option => {
                let p = [...selectablePlayers];
                let r = p.indexOf(option);
                [p[val], p[r]] = [p[r], p[val]];
                setSelectablePlayers(p);
              }}
              options={selectablePlayers}
              placeholder={"Select Player. . ."}
              closeMenuOnSelect={true}
              hideSelectedOptions={true}
            />
            <KDAGrid>
              <Box>
                <div>KDA</div>
                <div>{stats[player.value]["kda"].toFixed(2)}</div>
              </Box>
              <Box>
                <div>DPM</div>
                <div>{stats[player.value]["dpm"].toFixed(2)}</div>
              </Box>
              <Box>
                <div>GPM</div>
                <div>{stats[player.value]["gpm"].toFixed(2)}</div>
              </Box>
            </KDAGrid>
            {Object.entries(topThree[player.value]).map(([key, value]) => (
              <ChampionGrid key={"Row" + String(key)}>
                <Box key={"box" + String(player.value)}>
                  <Images
                    src={`images/${key}.png`}
                    key={"Image" + String(key)}
                  />
                </Box>
                <Box>{value} Played</Box>
              </ChampionGrid>
            ))}
          </Row>
        ))}
      </Container>
    </>
  );
}

export default ViewTeam;
