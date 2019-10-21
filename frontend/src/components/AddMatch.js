import React, { useState, useEffect } from "react";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import styled from "styled-components";
import PlayerInfo from "./PlayerInfo";
import debounce from "lodash.debounce";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { endpoint, prodEndpoint } from "../config";
import CreatableSelect from "react-select/creatable";

const ALL_TEAMS_QUERY = gql`
  query ALL_TEAMS_QUERY {
    teams {
      name
    }
  }
`;

const UPSERT_TEAM_MUTATION = gql`
  mutation UPSERT_TEAM_MUTATION($name: String!) {
    upsertTeam(
      where: { name: $name }
      update: { name: $name }
      create: { name: $name }
    ) {
      id
      name
    }
  }
`;

const UPSERT_PLAYER_MUTATION = gql`
  mutation UPSERT_PLAYER_MUTATION(
    $summonerName: String!
    $team: ID
    $role: String
  ) {
    upsertPlayer(
      where: { summonerName: $summonerName }
      update: { team: { connect: { id: $team } }, role: $role }
      create: {
        summonerName: $summonerName
        team: { connect: { id: $team } }
        role: $role
      }
    ) {
      id
      summonerName
      role
    }
  }
`;

const UPSERT_MATCH_MUTATION = gql`
  mutation UPSERT_MATCH_MUTATION(
    $id: ID
    $blueTop: ID!
    $blueJungle: ID!
    $blueMid: ID!
    $blueCarry: ID!
    $blueSupport: ID!
    $redTop: ID!
    $redJungle: ID!
    $redMid: ID!
    $redCarry: ID!
    $redSupport: ID!
    $blue: ID!
    $red: ID!
    $duration: Int!
    $winner: ID!
  ) {
    upsertMatch(
      where: { id: $id }
      update: {
        teams: { connect: [{ id: $blue }, { id: $red }] }
        players: {
          connect: [
            { id: $blueTop }
            { id: $blueJungle }
            { id: $blueMid }
            { id: $blueCarry }
            { id: $blueSupport }
            { id: $redTop }
            { id: $redJungle }
            { id: $redMid }
            { id: $redCarry }
            { id: $redSupport }
          ]
        }
      }
      create: {
        id: $id
        teams: { connect: [{ id: $blue }, { id: $red }] }
        players: {
          connect: [
            { id: $blueTop }
            { id: $blueJungle }
            { id: $blueMid }
            { id: $blueCarry }
            { id: $blueSupport }
            { id: $redTop }
            { id: $redJungle }
            { id: $redMid }
            { id: $redCarry }
            { id: $redSupport }
          ]
        }
        duration: $duration
        winner: { connect: { id: $winner } }
      }
    ) {
      id
    }
  }
`;

const STATS_QUERY = gql`
  query STATS_QUERY($match: ID!) {
    statses(where: { match: { id: $match } }) {
      id
      player {
        id
      }
      match {
        id
      }
    }
  }
`;

const UPSERT_STATS_MUTATION = gql`
  mutation UPSERT_STATS_MUTATION(
    $id: ID
    $player: ID!
    $match: ID!
    $role: String!
    $champion: String!
    $kills: Int!
    $deaths: Int!
    $assists: Int!
    $gold: Int!
    $damage: Int!
  ) {
    upsertStats(
      where: { id: $id }
      update: {
        player: { connect: { id: $player } }
        match: { connect: { id: $match } }
        role: $role
        champion: $champion
        kills: $kills
        deaths: $deaths
        assists: $assists
        gold: $gold
        damage: $damage
      }
      create: {
        player: { connect: { id: $player } }
        match: { connect: { id: $match } }
        role: $role
        champion: $champion
        kills: $kills
        deaths: $deaths
        assists: $assists
        gold: $gold
        damage: $damage
      }
    ) {
      id
    }
  }
`;

const Division = styled.div`
  float: ${props => props.direction};
  width: 45%;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: ${props => props.alignment};
  width: 100%;
`;

function AddMatch() {
  let baseStats = {
    id: "",
    summonerName: "",
    champion: "",
    role: "",
    kills: 0,
    deaths: 0,
    assists: 0,
    damage: 0,
    gold: 0,
  };

  let teamPlayerInfo = {
    top: { ...baseStats, role: "top" },
    jungle: { ...baseStats, role: "jungle" },
    mid: { ...baseStats, role: "mid" },
    carry: { ...baseStats, role: "carry" },
    support: { ...baseStats, role: "support" },
  };

  const roles = [
    "top",
    "jungle",
    "mid",
    "carry",
    "support",
    "top",
    "jungle",
    "mid",
    "carry",
    "support",
  ];

  // State variables.
  const [isLoaded, setIsLoaded] = useState(false);
  const [matchID, setMatchID] = useState(0);
  const [blueTeam, setBlueTeam] = useState({ ...teamPlayerInfo });
  const [redTeam, setRedTeam] = useState({ ...teamPlayerInfo });
  const [teamNames, setTeamNames] = useState({ blue: "", red: "" });
  const [matchInfo, setMatchInfo] = useState({ winner: "", duration: 0 });
  const [selectableTeams, setSelectableTeams] = useState([]);
  const [blueTeamValue, setBlueTeamValue] = useState("");
  const [redTeamValue, setRedTeamValue] = useState("");

  // Queries.
  const { data } = useQuery(STATS_QUERY, {
    variables: { match: matchID },
  });
  const { data: allTeamNames } = useQuery(ALL_TEAMS_QUERY);

  // Mutations.
  const [upsertTeam, { team }] = useMutation(UPSERT_TEAM_MUTATION);
  const [upsertPlayer, { player }] = useMutation(UPSERT_PLAYER_MUTATION);
  const [upsertMatch, { match }] = useMutation(UPSERT_MATCH_MUTATION);
  const [upsertStats, { stats }] = useMutation(UPSERT_STATS_MUTATION);

  const callBackendAPI = async match => {
    let url = process.env.NODE_ENV === "development" ? endpoint : prodEndpoint;
    const response = await fetch(`${url}/addmatch?match=${match}`);
    if (response.status !== 200) {
      throw Error(body.message);
    }

    const body = await response.json();
    if (body["message"]) {
      delete baseStats.summonerName;
      setBlueTeam({ ...teamPlayerInfo });
      setRedTeam({ ...teamPlayerInfo });
    }
    const apiData = body["data"];

    // 3102504145
    if (apiData && apiData["participants"].length === 10) {
      console.log(apiData);
      let blueLaneInfo = {};
      let redLaneInfo = {};
      const setLane = i => {
        const {
          kills,
          deaths,
          assists,
          totalDamageDealtToChampions: damage,
          goldEarned: gold,
        } = apiData["participants"][i]["stats"];
        return {
          champion: apiData["participants"][i]["champion"],
          kills: Number(kills),
          deaths: Number(deaths),
          assists: Number(assists),
          role: roles[i],
          damage: Number(damage),
          gold: Number(gold),
        };
      };

      Object.keys(blueTeam).forEach((position, index) => {
        blueLaneInfo[position] = {};
        redLaneInfo[position] = {};
        blueLaneInfo[position] = {
          ...setLane(index),
        };
        redLaneInfo[position] = {
          ...setLane(index + 5),
        };
      });
      setBlueTeam({ ...blueTeam, ...blueLaneInfo });

      setRedTeam({ ...redTeam, ...redLaneInfo });

      setMatchInfo({
        duration: apiData.gameDuration,
        winner: apiData.teams[0]["win"],
      });
    }
    setIsLoaded(false);
  };

  const getMatch = debounce(async e => {
    const { value } = e.target;

    setMatchID(value);
  }, 350);

  useEffect(() => {
    callBackendAPI(matchID);
  }, [matchID]);

  useEffect(() => {
    let teamsArray = [];
    if (allTeamNames) {
      for (let i in allTeamNames.teams) {
        teamsArray.push({
          value: allTeamNames.teams[i].name,
          label: allTeamNames.teams[i].name,
        });
      }
    }
    setSelectableTeams(teamsArray);
  }, [allTeamNames]);

  return (
    <Form
      onSubmit={async e => {
        e.preventDefault();
        let {
          data: {
            upsertTeam: { id: blueTeamID },
          },
        } = await upsertTeam({
          variables: { name: teamNames.blue },
        });
        let {
          data: {
            upsertTeam: { id: redTeamID },
          },
        } = await upsertTeam({
          variables: { name: teamNames.red },
        });

        let bluePlayersPromise = await Promise.all(
          Object.keys(blueTeam).map(player => {
            return upsertPlayer({
              variables: {
                summonerName: blueTeam[player]["summonerName"],
                role: blueTeam[player]["role"],
                team: blueTeamID,
              },
            });
          })
        );

        let redPlayersPromise = await Promise.all(
          Object.keys(redTeam).map(player => {
            return upsertPlayer({
              variables: {
                summonerName: redTeam[player]["summonerName"],
                role: redTeam[player]["role"],
                team: redTeamID,
              },
            });
          })
        );

        if (matchInfo.winner === "") {
          setMatchInfo({ ...matchInfo, winner: "Win" });
        }

        let match = await upsertMatch({
          variables: {
            id: matchID,
            blueTop: bluePlayersPromise[0].data.upsertPlayer.id,
            blueJungle: bluePlayersPromise[1].data.upsertPlayer.id,
            blueMid: bluePlayersPromise[2].data.upsertPlayer.id,
            blueCarry: bluePlayersPromise[3].data.upsertPlayer.id,
            blueSupport: bluePlayersPromise[4].data.upsertPlayer.id,
            redTop: redPlayersPromise[0].data.upsertPlayer.id,
            redJungle: redPlayersPromise[1].data.upsertPlayer.id,
            redMid: redPlayersPromise[2].data.upsertPlayer.id,
            redCarry: redPlayersPromise[3].data.upsertPlayer.id,
            redSupport: redPlayersPromise[4].data.upsertPlayer.id,
            blue: blueTeamID,
            red: redTeamID,
            duration: matchInfo.duration,
            winner: matchInfo["winner"] === "Win" ? blueTeamID : redTeamID,
          },
        });

        let blueStatsPromise = await Promise.all(
          Object.keys(blueTeam).map((player, index) => {
            let x = 0;
            let p = data["statses"];
            Object.keys(p).forEach(function(elem) {
              if (
                p[elem]["player"]["id"] ===
                bluePlayersPromise[index].data.upsertPlayer.id
              ) {
                x = p[elem]["id"];
              }
            });
            return upsertStats({
              variables: {
                id: x,
                player: bluePlayersPromise[index].data.upsertPlayer.id,
                match: matchID,
                role: blueTeam[player]["role"],
                champion: blueTeam[player]["champion"],
                kills: parseInt(blueTeam[player]["kills"], 10),
                deaths: parseInt(blueTeam[player]["deaths"], 10),
                assists: parseInt(blueTeam[player]["assists"], 10),
                gold: parseInt(blueTeam[player]["gold"], 10),
                damage: parseInt(blueTeam[player]["damage"], 10),
              },
            });
          })
        );

        let redStatsPromise = await Promise.all(
          Object.keys(redTeam).map((player, index) => {
            let x = 0;
            let p = data["statses"];
            Object.keys(p).forEach(function(elem) {
              if (
                p[elem]["player"]["id"] ===
                redPlayersPromise[index].data.upsertPlayer.id
              ) {
                x = p[elem]["id"];
              }
            });
            return upsertStats({
              variables: {
                id: x,
                player: redPlayersPromise[index].data.upsertPlayer.id,
                match: matchID,
                role: redTeam[player]["role"],
                champion: redTeam[player]["champion"],
                kills: parseInt(redTeam[player]["kills"], 10),
                deaths: parseInt(redTeam[player]["deaths"], 10),
                assists: parseInt(redTeam[player]["assists"], 10),
                gold: parseInt(redTeam[player]["gold"], 10),
                damage: parseInt(redTeam[player]["damage"], 10),
              },
            });
          })
        );
        setMatchID(0);
      }}
    >
      <Row>
        <label htmlFor="matchID">
          <input
            type="number"
            id="matchID"
            name="matchID"
            placeholder="Match ID"
            onChange={e => {
              e.persist();
              setIsLoaded(true);
              getMatch(e);
            }}
          />
        </label>
        <label htmlFor="duration">
          <input
            type="number"
            id="duration"
            name="duration"
            value={matchInfo.duration}
            placeholder="Match duration (seconds)"
            onChange={e => {
              e.persist();
              setMatchInfo({
                ...matchInfo,
                duration: parseInt(e.target.value, 10),
              });
            }}
          />
        </label>
      </Row>

      <fieldset disabled={isLoaded} aria-busy={isLoaded}>
        <Division direction="left">
          Blue Side
          <label players="true" htmlFor="blueTeamName">
            <CreatableSelect
              value={blueTeamValue}
              isRequired
              onChange={option => {
                setBlueTeamValue(option);
                setTeamNames({ ...teamNames, blue: option.value });
              }}
              options={selectableTeams}
              placeholder={"Select Team. . ."}
              createOptionPosition={"first"}
              closeMenuOnSelect={true}
              hideSelectedOptions={true}
              formatCreateLabel={() => `Add`}
              theme={theme => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  text: "black",
                  primary25: "#36B37E",
                  primary: "black",
                },
              })}
            />
          </label>
          {Object.keys(blueTeam).map(role => (
            <fieldset player="true" key={role}>
              <legend>{role.charAt(0).toUpperCase() + role.slice(1)}</legend>
              <PlayerInfo
                playerData={blueTeam}
                setPlayerData={setBlueTeam}
                position={role}
                key={role}
              />
            </fieldset>
          ))}
          <button type="submit">Submit</button>
        </Division>
        <Division direction="right">
          Red Side
          <label player="true" htmlFor="redTeam">
            <CreatableSelect
              value={redTeamValue}
              isRequired
              onChange={option => {
                setRedTeamValue(option);
                setTeamNames({ ...teamNames, red: option.value });
              }}
              options={selectableTeams}
              placeholder={"Select Team. . ."}
              createOptionPosition={"first"}
              closeMenuOnSelect={true}
              hideSelectedOptions={true}
              formatCreateLabel={() => `Add`}
              theme={theme => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  text: "black",
                  primary25: "#36B37E",
                  primary: "black",
                },
              })}
            />
          </label>
          {Object.keys(redTeam).map(role => (
            <fieldset player="true" key={role}>
              <legend>{role.charAt(0).toUpperCase() + role.slice(1)}</legend>
              <PlayerInfo
                playerData={redTeam}
                setPlayerData={setRedTeam}
                position={role}
                key={role}
              />
            </fieldset>
          ))}
        </Division>
      </fieldset>
    </Form>
  );
}

AddMatch.propTypes = {
  player: PropTypes.shape({
    accountID: PropTypes.string,
    summonerID: PropTypes.string,
    summonerName: PropTypes.string,
    role: PropTypes.string,
    matches: PropTypes.array,
    id: PropTypes.string,
  }),
  match: PropTypes.shape({
    id: PropTypes.string,
    players: PropTypes.array,
    teams: PropTypes.array,
    duration: PropTypes.number,
  }),
  stats: PropTypes.shape({
    id: PropTypes.string,
    player: PropTypes.object,
    role: PropTypes.string,
    match: PropTypes.object,
    champion: PropTypes.string,
    kills: PropTypes.number,
    deaths: PropTypes.number,
    assists: PropTypes.number,
    gold: PropTypes.number,
    damage: PropTypes.number,
  }),
};

export default AddMatch;
