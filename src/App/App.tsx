import React, { useEffect, useState } from 'react';

import NewsItem from '../components/NewsItem';

import HN from '../constants/APIRoutes';

import { IStoryRecord } from '../types/IRecordsStructure';
import './App.css';
import { RECORD_FETCH_ERROR, USER_FETCH_ERROR } from '../constants/Errors';

const App: React.FC = () => {
  const [stories, setStories] = useState<Array<IStoryRecord>>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchData = () => fetch(`${HN}/topstories.json`)
    .then((res) => res.json())
    .then((res) => {
      const sortedRecords = res
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      return sortedRecords;
    })
    .catch(() => setErrorMessage(RECORD_FETCH_ERROR));

  const fetchStoryInfo = (storiesId: Array<number>) => Promise.all(
    storiesId.map((storyId: number) => fetch(`${HN}/item/${storyId}.json`)
      .then((res) => res.json())
      .then((story: Array<IStoryRecord>) => story)
      .catch(() => setErrorMessage(RECORD_FETCH_ERROR))),
  );

  const fetchAuthorInfo = (storyRecords: IStoryRecord[] | any) => Promise.all(
    storyRecords.map((storyItem: IStoryRecord) => fetch(`${HN}/user/${storyItem.by}.json`)
      .then((res) => res.json())
      .then((res) => ({ ...storyItem, user: res }))
      .catch(() => setErrorMessage(USER_FETCH_ERROR))),
  );

  useEffect(() => {
    setLoading(true);

    fetchData()
      .then((storiesId) => fetchStoryInfo(storiesId))
      .then((storyRecords) => fetchAuthorInfo(storyRecords))
      .then((res: Array<IStoryRecord> | any) => {
        const sortedList = res.sort(
          (a: IStoryRecord, b: IStoryRecord) => (a.score < b.score ? -1 : 1),
        );

        setStories(sortedList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="App">

      {!!errorMessage && <p className="notification bgRed">{errorMessage}</p>}
      {isLoading && !errorMessage && <p className="notification bgGreen">Loading...</p>}

      {!errorMessage && stories.map((story: IStoryRecord) => (
        <NewsItem
          key={story.id}
          isLoading={isLoading}
          story={story}
        />
      ))}
    </div>
  );
};

export default App;
