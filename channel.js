export async function getChannelId(){
    let test = window.fetch(`https://wind-bow.glitch.me/helix/users?login=silvername`)
                        .then(glitchResponse => glitchResponse.json());
    
    let channelId = await Promise.resolve(test)
                                    .then(value => value['data']['0']['id']);
                                    
    return channelId;
}
