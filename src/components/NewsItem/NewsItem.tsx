import React from 'react';

import {
  authorScoreIcon, copyIcon, redirectIcon, starIcon, userIcon,
} from '../../images';

import { IStoryRecord } from '../../types/RecordsStructure';
import './NewsItem.css';

const NewsItem: React.FC<{story: IStoryRecord, isLoading: boolean}> = (
  { story, isLoading }: {story: IStoryRecord, isLoading: boolean },
) => {
  const { user } = story;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(story.url);
  };

  const goToURL = () => {
    window.open(story.url);
  };

  return (
    isLoading ? (
      <div className={`newsItem ${isLoading ? 'loading' : ''}`} />
    ) : (

      <div className="newsItem">
        <hr
          className="coloredLine"
          style={{ borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}
        />

        <div className="nav">
          <span className="smallText">
            {new Date(story.time).toLocaleDateString('en-US', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>

          <div className="navButtons">
            <button value={story.url} type="button" onClick={goToURL}>
              <label className="tooltipBottom" data-tooltip="Go to website">
                <img src={redirectIcon} alt="Go to website" />
              </label>
            </button>

            <button value={story.url} type="button" onClick={copyToClipboard}>
              <label className="tooltipBottom" data-tooltip="Copy to clipboard">
                <img src={copyIcon} alt="Copy to clipboard" />
              </label>
            </button>
          </div>
        </div>

        <p className="mainText">{story.title}</p>

        <p className="subText">
          <label data-tooltip="Stars">
            <img src={starIcon} alt="Stars" />
            {story.score}
          </label>
        </p>

        <p className="subText">
          <label data-tooltip="User name">
            <img src={userIcon} alt="User name" />
            {user.id}
          </label>
        </p>

        <p className="subText">
          <label data-tooltip="User karma">
            <img src={authorScoreIcon} alt="User karma" />
            <span>{user.karma}</span>
          </label>
        </p>

      </div>
    )
  );
};

export default NewsItem;
